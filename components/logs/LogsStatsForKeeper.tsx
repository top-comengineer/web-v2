/* eslint-disable @typescript-eslint/no-explicit-any */
import	React, {ReactElement, ReactNode}			from	'react';
import	{useTable, usePagination, useSortBy}		from	'react-table';
import	Link										from	'next/link';
import	axios										from	'axios';
import	{Chevron, LinkOut}							from	'@yearn/web-lib/icons';
import	{format, performBatchedUpdates, toAddress}	from	'@yearn/web-lib/utils';
import	IconLoader									from	'components/icons/IconLoader';
import	REGISTRY									from	'utils/registry';

type		TWorkLogs = {
	keeperAddress: string,
	searchTerm: string,
	prices: {
		ethereum: number,
		keep3rv1: number
	}
}
type		TLogs = {
	time: number,
	txHash: string,
	job: string,
	keeper: string,
	earned: string,
	fees: string,
	gwei: string
}
function	LogsStatsForKeeper({keeperAddress, prices, searchTerm}: TWorkLogs): ReactElement {
	const	[isInit, set_isInit] = React.useState(false);
	const	[logs, set_logs] = React.useState<TLogs[]>([]);

	React.useEffect((): void => {
		axios.get(`${process.env.BACKEND_URI as string}/keeper/${toAddress(keeperAddress)}`)
			.then((_logs): void => {
				performBatchedUpdates((): void => {
					set_logs(_logs.data || []);
					set_isInit(true);
				});
			})
			.catch((): void => set_isInit(true));
	}, [keeperAddress]);

	const data = React.useMemo((): unknown[] => (
		logs
			.filter((log): boolean => (
				(log.job).toLowerCase()?.includes(searchTerm.toLowerCase())
				|| (REGISTRY[toAddress(log.job)]?.name || '').toLowerCase()?.includes(searchTerm.toLowerCase())
			)).map((log): unknown => ({
				date: format.date(Number(log.time) * 1000, true),
				jobName: REGISTRY[toAddress(log.job)]?.name || 'Unverified Job',
				earnedKp3r: format.toNormalizedAmount(log.earned, 18),
				earnedUsd: format.amount(format.toNormalizedValue(log.earned, 18) * (prices.keep3rv1), 2, 2),
				fees: format.toNormalizedAmount(log.fees, 18),
				gweiPerCall: format.toNormalizedAmount(log.gwei, 9),
				linkOut: log.job
			}))
	), [logs, prices.keep3rv1, searchTerm]);
		
	const columns = React.useMemo((): unknown[] => [
		{Header: 'Date', accessor: 'date', className: 'pr-8'},
		{Header: 'Job name', accessor: 'jobName', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'Earned, KP3R', accessor: 'earnedKp3r', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'Earned, $', accessor: 'earnedUsd', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'TX fees, ETH', accessor: 'fees', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'GWEI per call', accessor: 'gweiPerCall', className: 'cell-end pr-6', sortType: 'basic'},
		{Header: '', accessor: 'linkOut', className: 'cell-end', Cell: ({value}: {value: string}): ReactNode => (
			<div>
				<a href={`https://etherscan.io/address/${value}`} target={'_blank'} rel={'noopener noreferrer'}>
					<LinkOut className={'w-6 h-6 text-black cursor-pointer'} />
				</a>
			</div>
		)}
	], []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		nextPage,
		previousPage,
		state: {pageIndex}
	} = useTable({columns, data, initialState: {pageSize: 50}}, useSortBy, usePagination);
	
	function	renderPreviousChevron(): ReactElement {
		if (!canPreviousPage) 
			return (<Chevron className={'w-4 h-4 opacity-50 cursor-not-allowed'} />);
		return (
			<Chevron
				className={'w-4 h-4 cursor-pointer'}
				onClick={previousPage} />
		);
	}

	function	renderNextChevron(): ReactElement {
		if (!canNextPage) 
			return (<Chevron className={'w-4 h-4 opacity-50 rotate-180 cursor-not-allowed'} />);
		return (
			<Chevron
				className={'w-4 h-4 rotate-180 cursor-pointer'}
				onClick={nextPage} />
		);
	}

	if (!isInit && logs.length === 0) {
		return (
			<div className={'flex justify-center items-center h-full min-h-[112px]'}>
				<IconLoader className={'w-6 h-6 animate-spin'} />
			</div>
		);
	}

	return (
		<div className={'flex overflow-x-scroll flex-col w-full'}>
			<table
				{...getTableProps()}
				className={'overflow-x-scroll min-w-full'}>
				<thead>
					{headerGroups.map((headerGroup: any): ReactElement => (
						<tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any): ReactElement => (
								<th
									key={column.getHeaderProps().key}
									{...column.getHeaderProps(column.getSortByToggleProps([{
										className: `pt-2 pb-8 text-left text-base font-bold whitespace-pre ${column.className}`
									}]))}>
									{column.render('Header')}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row: any): ReactElement => {
						prepareRow(row);
						return (
							<Link key={row.getRowProps().key} href={`/jobs/${row.values.linkOut}`}>
								<tr {...row.getRowProps()} className={'hover:bg-white transition-colors cursor-pointer'}>
									{row.cells.map((cell: any): ReactElement => {
										return (
											<td
												key={cell.getCellProps().key}
												{...cell.getCellProps([
													{
														className: `pt-2 pb-6 text-base font-mono whitespace-pre ${cell.column.className}`,
														style: cell.column.style
													}])
												}>
												{cell.render('Cell')}
											</td>
										);
									})}
								</tr>
							</Link>
						);
					})}
				</tbody>
			</table>
			{canPreviousPage || canNextPage ? <div className={'flex flex-row justify-end items-center p-4 space-x-2'}>
				{renderPreviousChevron()}
				<p className={'text-sm tabular-nums select-none'}>
					{`${pageIndex + 1}/${pageOptions.length}`}
				</p>
				{renderNextChevron()}
			</div> : null}
		</div>
	);
}

export default LogsStatsForKeeper;