export type	TPrices = {
	ethereum: number,
	keep3rv1: number
}

// pages/stats/index.tsx
export type TStatsIndexData = {
	bondedKp3r: string,
	jobs: number,
	keepers: number,
	workDone: number,
	normalizedBondedKp3r: string,
	normalizedRewardedKp3r: string,
	rewardedKp3r: string,
	isSuccessful: boolean
}
export type	TStatsIndex = {
	stats: TStatsIndexData,
	prices: TPrices
}

// pages/stats/[address].tsx
export type TStatsAddressData = {
	balanceOf: string,
	bonds: string,
	keeper: string,
	earned: string,
	fees: string,
	gwei: string,
	workDone: number,
	isSuccessful: boolean
}
export type	TStatsAddress = {
	stats: TStatsAddressData,
	prices: TPrices
}

// pages/job/[address]/index.tsx
export type TJobIndexData = {
	job: string,
	name: string,
	shortName: string,
	isVerified: boolean
}
export type	TJobIndex = {
	stats: TJobIndexData
}

// pages/job/[address]/calls.tsx
export type TJobCallsData = {
	job: string,
	shortName: string
}
export type	TJobCalls = {
	stats: TJobCallsData
}

// pages/disputes.tsx
export type TDisputeData = {
	disputers: string[],
	slashers: string[],
	governance: string
}
export type	TDispute = {
	stats: TDisputeData
}

// import	type {TStatsIndexData, TStatsIndex}	from	'utils/types.d';