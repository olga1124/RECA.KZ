import type { FC } from 'react';

interface CallbackBtnProps { }

const CallbackBtn: FC<CallbackBtnProps> = () => {
	return (
		<a href='https://wa.me/77758887203' target='_blank' className="callback-bt">
			<div className="text-call">
				<svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M15.5833 32.9583C21.5833 44.75 31.25 54.375 43.0417 60.4167L52.2083 51.25C53.3333 50.125 55 49.75 56.4583 50.25C61.125 51.7917 66.1667 52.625 71.3333 52.625C73.625 52.625 75.5 54.5 75.5 56.7917V71.3333C75.5 73.625 73.625 75.5 71.3333 75.5C32.2083 75.5 0.5 43.7917 0.5 4.66667C0.5 2.375 2.375 0.5 4.66667 0.5H19.25C21.5417 0.5 23.4167 2.375 23.4167 4.66667C23.4167 9.875 24.25 14.875 25.7917 19.5417C26.25 21 25.9167 22.625 24.75 23.7917L15.5833 32.9583Z" />
				</svg>
			</div>
		</a>
	);
}

export default CallbackBtn;
