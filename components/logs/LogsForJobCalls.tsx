/* eslint-disable @typescript-eslint/no-explicit-any */
import	React, {ReactElement, ReactNode}				from	'react';
import	axios											from	'axios';
import	{useTable, usePagination, useSortBy}			from	'react-table';
import	{LinkOut, Chevron}								from	'@yearn-finance/web-lib/icons';
import	{format, performBatchedUpdates, truncateHex}	from	'@yearn-finance/web-lib/utils';
import	IconLoader										from	'components/icons/IconLoader';
import	IconChevronFilled								from	'components/icons/IconChevronFilled';

type		TWorkLogs = {
	keeper: string,
	time: number,
	earned: string,
	fees: string,
	gwei: string,
	txHash: string
}
function	LogsForJobCalls({jobAddress, searchTerm}: {jobAddress: string, searchTerm: string}): ReactElement {
	const	[isInit, set_isInit] = React.useState(false);
	const	[logs, set_logs] = React.useState<TWorkLogs[]>([]);

	React.useEffect((): void => {
		axios.get(`${process.env.BACKEND_URI as string}/job/${jobAddress}`)
			.then((_logs): void => {
				performBatchedUpdates((): void => {
					set_logs(_logs.data || []);
					set_isInit(true);
				});
			})
			.catch((): void => set_isInit(true));
	}, [jobAddress]);

	const data = React.useMemo((): unknown[] => (
		logs
			.filter((log): boolean => (
				(log?.keeper || '').toLowerCase()?.includes(searchTerm.toLowerCase()))
			).map((log): unknown => ({
				date: format.date(Number(log.time) * 1000, true),
				keeper: truncateHex(log.keeper, 5),
				spentKp3r: format.toNormalizedValue(log?.earned || '0', 18),
				fees: format.toNormalizedValue(log?.fees || '0', 18),
				gweiPerCall: format.toNormalizedValue(log?.gwei || '0', 9),
				linkOut: log?.txHash || ''
			}))
	), [logs, searchTerm]);
		
	const columns = React.useMemo((): unknown[] => [
		{Header: 'Date', accessor: 'date', className: 'pr-8'},
		{Header: 'Keeper', accessor: 'keeper', className: 'cell-end pr-8', sortType: 'basic'},
		{
			Header: 'Spent, KP3R', accessor: 'spentKp3r', className: 'cell-end pr-8', sortType: 'basic',
			Cell: ({value}: {value: number}): ReactNode => format.amount(value, 2, 2)
		},
		{
			Header: 'TX fees, ETH', accessor: 'fees', className: 'cell-end pr-8', sortType: 'basic',
			Cell: ({value}: {value: number}): ReactNode => format.amount(value, 2, 2)
		},
		{
			Header: 'Spent, GWEI', accessor: 'gweiPerCall', className: 'cell-end pr-6', sortType: 'basic',
			Cell: ({value}: {value: number}): ReactNode => format.amount(value, 2, 2)
		},
		{
			Header: '', accessor: 'linkOut', className: 'cell-end', disableSortBy: true,
			Cell: ({value}: {value: string}): ReactNode => (
				<div>
					<a href={`https://etherscan.io/address/${value}`} target={'_blank'} rel={'noopener noreferrer'}>
						<LinkOut className={'h-6 w-6 cursor-pointer text-black'} />
					</a>
				</div>
			)
		}
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
										className: 'pt-2 pb-8 text-left text-base font-bold whitespace-pre'
									}]))}>
									<div className={`flex flex-row items-center ${column.className}`}>
										{column.render('Header')}
										{column.canSort ? <div className={'ml-1'}>
											{column.isSorted
												? column.isSortedDesc
													? <IconChevronFilled className={'h-4 w-4 cursor-pointer text-neutral-500'} />
													: <IconChevronFilled className={'h-4 w-4 rotate-180 cursor-pointer text-neutral-500'} />
												: <IconChevronFilled className={'h-4 w-4 cursor-pointer text-neutral-300 transition-colors hover:text-neutral-500'} />}
										</div> : null}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row: any): ReactElement => {
						prepareRow(row);
						return (
							<tr
								key={row.getRowProps().key}
								{...row.getRowProps()}
								className={'cursor-pointer transition-colors hover:bg-white'}
								onClick={(): void => (window as any).open(`https://etherscan.io/tx/${row.values.linkOut}`, '_blank')}>
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

export default LogsForJobCalls;