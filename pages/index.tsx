import	React, {ReactElement}	from	'react';
import	SectionKeepersWanted	from	'components/sections/home/SectionKeepersWanted';
import	SectionUnderstandSetup	from	'components/sections/home/SectionUnderstandSetup';
import	SectionBestJobs			from	'components/sections/home/SectionBestJobs';

function	Index(): ReactElement {
	return (
		<main className={'flex flex-col col-span-12 px-4 my-10 mx-auto w-full max-w-6xl min-h-[100vh]'}>
			<div className={'grid grid-cols-1 gap-12 md:grid-cols-2'}>
				<section aria-label={'KEEPERS STATUS'}>
					<SectionKeepersWanted />
					<SectionUnderstandSetup />
				</section>
				<SectionBestJobs />
			</div>
		</main>
	);
}

export default Index;
