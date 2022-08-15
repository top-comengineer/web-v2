/* eslint-disable @typescript-eslint/no-explicit-any */
import	React, {ReactElement, ReactNode}				from	'react';
import	{useTable, usePagination, useSortBy}			from	'react-table';
import	axios											from	'axios';
import	Link											from	'next/link';
import	{Chevron}										from	'@yearn-finance/web-lib/icons';
import	{format, truncateHex, performBatchedUpdates}	from	'@yearn-finance/web-lib/utils';
import	IconLoader										from	'components/icons/IconLoader';

type		TWorkLogs = {
	keeper: string,
	earned: string,
	fees: string,
	gwei: string,
	workDone: number
}
type		TLogs = {
	searchTerm: string,
	prices: {
		ethereum: number,
		keep3rv1: number
	}
}
function	LogsStatsPerKeeper({searchTerm, prices}: TLogs): ReactElement {
	const	[isInit, set_isInit] = React.useState(false);
	const	[logs, set_logs] = React.useState<TWorkLogs[]>([]);

	React.useEffect((): void => {
		axios.get(`${process.env.BACKEND_URI as string}/works/keepers`)
			.then((_logs): void => {
				performBatchedUpdates((): void => {
					set_logs(_logs.data || []);
					set_isInit(true);
				});
			})
			.catch((): void => set_isInit(true));
	}, []);

	const data = React.useMemo((): unknown[] => (
		logs
			.filter((log): boolean => log.keeper?.includes(searchTerm))
			.map((log): unknown => ({
				address: log.keeper,
				earnedKp3r: format.amount(Number(log.earned), 2, 2),
				earnedUsd: format.amount(Number(log.earned) * (prices.keep3rv1), 2, 2),
				fees: format.amount(Number(log.fees) * (prices.ethereum), 2, 2),
				netEarned: format.amount(Number(log.earned) * (prices.keep3rv1) - Number(log.fees) * (prices.ethereum), 2, 2),
				calls: log.workDone,
				kp3rPerCall: format.amount(Number(log.earned) / log.workDone, 2, 2),
				gweiPerCall: format.amount(Number(log.gwei) / log.workDone, 2, 2)
			}))
	), [logs, prices.ethereum, prices.keep3rv1, searchTerm]);
		
	const columns = React.useMemo((): unknown[] => [
		{Header: 'Keeper', accessor: 'address', className: 'pr-8', Cell: ({value}: {value: string}): ReactNode => truncateHex(value, 5)},
		{Header: 'Earned, KP3R', accessor: 'earnedKp3r', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'Earned, $', accessor: 'earnedUsd', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'TX fees, $', accessor: 'fees', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'Net earned, $', accessor: 'netEarned', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'Calls', accessor: 'calls', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'KP3R per call ', accessor: 'kp3rPerCall', className: 'cell-end pr-8', sortType: 'basic'},
		{Header: 'GWEI per call', accessor: 'gweiPerCall', className: 'cell-end', sortType: 'basic'}
	], []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, //with pagination
		canPreviousPage,
		canNextPage,
		pageOptions,
		nextPage,
		previousPage,
		state: {pageIndex}
	} = useTable({columns, data, initialState: {pageSize: 50}}, useSortBy, usePagination);
	
	function	renderPreviousChevron(): ReactElement {
		if (!canPreviousPage) 
			return (<Chevron className={'h-4 w-4 cursor-not-allowed opacity-50'} />);
		return (
			<Chevron
				className={'h-4 w-4 cursor-pointer'}
				onClick={previousPage} />
		);
	}

	function	renderNextChevron(): ReactElement {
		if (!canNextPage) 
			return (<Chevron className={'h-4 w-4 rotate-180 cursor-not-allowed opacity-50'} />);
		return (
			<Chevron
				className={'h-4 w-4 rotate-180 cursor-pointer'}
				onClick={nextPage} />
		);
	}

	if (!isInit && logs.length === 0) {
		return (
			<div className={'flex h-full min-h-[112px] items-center justify-center'}>
				<IconLoader className={'h-6 w-6 animate-spin'} />
			</div>
		);
	}

	return (
		<div className={'flex w-full flex-col overflow-x-scroll'}>
			<table
				{...getTableProps()}
				className={'min-w-full overflow-x-scroll'}>
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
							<Link key={row.getRowProps().key} href={`/stats/${row.values.address}`}>
								<tr {...row.getRowProps()} className={'cursor-pointer transition-colors hover:bg-white'}>
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
			{canPreviousPage || canNextPage ? <div className={'flex flex-row items-center justify-end space-x-2 p-4'}>
				{renderPreviousChevron()}
				<p className={'select-none text-sm tabular-nums'}>
					{`${pageIndex + 1}/${pageOptions.length}`}
				</p>
				{renderNextChevron()}
			</div> : null}
		</div>
	);
}

export default LogsStatsPerKeeper;
