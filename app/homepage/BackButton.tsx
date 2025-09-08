import { useTranslation } from "react-i18next";
import { PiSignOut } from "react-icons/pi";
import { Track } from "~/track";

type BackButtonProps = {
	backUrl: string;
	backText: string;
};

export function BackButton({ backUrl, backText }: BackButtonProps) {
	return (
		<button
			aria-label={backText}
			className="btn px-2 ms-3"
			onClick={() => {
				Track('navigation', 'back');
				if (backUrl) {
					window.location.href = backUrl;
				} else {
					window.history.back();
				}
			}}
			title={backText}
		>
			<PiSignOut color="primary" size={32} />
		</button>
	);
}
