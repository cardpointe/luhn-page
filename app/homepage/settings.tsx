import * as React from 'react';
import { PiGear } from "react-icons/pi";
import { Trans, useTranslation } from 'react-i18next';
import { PiMoonBold, PiSunBold } from 'react-icons/pi';
import { MdBrightness6, MdOutlinePhonelink } from "react-icons/md";
import type { IconType } from 'react-icons';
import { useEffect } from 'react';


export type Mode = (typeof modes)[number];

export const modes = ['light', 'dark', 'auto'] as const;

type ModeItem = {
    value: Mode;
    icon: IconType;
}

const modeItems: ModeItem[] = [
    { value: "auto", icon: MdOutlinePhonelink },
    { value: "light", icon: PiSunBold },
    { value: "dark", icon: PiMoonBold },
];

export function getCurrentMode(): Mode {

    if (typeof window !== 'undefined') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }

    return 'auto';
}

function saveMode(theMode: Mode) {
    if (!theMode || theMode == 'auto') {
        document.documentElement.removeAttribute('data-theme');
        //deleteCookie('theme');
    } else {
        document.documentElement.setAttribute('data-theme', theMode);
        //setCookie('theme', theMode);
    }
}



export default function Settings() {
    const { t, i18n } = useTranslation(); 

    const [currentMode, setMode] = React.useState('auto' as Mode);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    useEffect(() => {
        setMode(getCurrentMode());
    }, []);

    const handleClick = () => {
        const theDialog = document.getElementById("settings-dialog")
        if (!theDialog) {
            console.log("Null menu!?!");
            return;
        }
        (theDialog as HTMLDialogElement).showModal();
    };

    const handleClose = () => {
        setAnchorEl(null);
        const theDialog = document.getElementById("settings-dialog")
        if (!theDialog) {
            console.log("Null menu!?!");
            return;
        }
        (theDialog as HTMLDialogElement).close();
    };

    return (
        <>
            <div
                className="btn px-2"
                id="settings-button"
                aria-controls={open ? 'settings-dialog' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <PiGear color="primary" size={32} />
            </div>
            <dialog
                className="modal"
                id="settings-dialog"
                open={open}
                onClose={() => handleClose()}
            >
                <div className="modal-box w-75 flex flex-col gap-0 p-0">
                    <span className="p-3 text-xl font-bold border-b border-neutral/50">{t('settings')}</span>
                    <div className="p-3">
                        <div className="font-bold pb-2">{t('settings_mode')}</div>
                        {modeItems.map((option) => (
                        <div
                            className="flex flex-row items-center ps-4 pb-1"
                            key={option.value}
                            onClick={() => {
                                setMode(option.value); 
                                saveMode(option.value);
                            }}
                            >
                            <option.icon />
                            <span className="ps-3">{
                                option.value == currentMode 
                                    ? t("settings_mode_current", { mode: t(`settings_mode_${option.value}`) }) 
                                    : t(`settings_mode_${option.value}`)
                                }</span>
                        </div>
                    ))
                    }
                    </div>
                    <div className="flex justify-center items-center p-3">
                        <button
                            className="btn btn-primary w-full"
                            onClick={() => {
                                handleClose();
                            }}>{t('settings_close')}</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
//                        {t('settings_length')}
//                        {t('settings_language')}
