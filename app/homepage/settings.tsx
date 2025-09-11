import * as React from 'react';
import { PiGear } from "react-icons/pi";
import { Trans, useTranslation } from 'react-i18next';
import { PiMoonBold, PiSunBold } from 'react-icons/pi';
import { MdBrightness6, MdOutlinePhonelink } from "react-icons/md";
import type { IconType } from 'react-icons';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { locales } from '../i18n';
import { useSearchParams } from 'react-router';

import { Track } from "../track";

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

    const savedMode = Cookies.get('mode') || 'auto';
    if (savedMode && modes.includes(savedMode as Mode)) {
        return savedMode as Mode;
    }

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
        Cookies.remove('mode');
    } else {
        document.documentElement.setAttribute('data-theme', theMode);
        Cookies.set('mode', theMode, { expires: 365 });
    }
}

export function Settings() {
    const { t, i18n } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();

    const [currentMode, setMode] = React.useState('auto' as Mode);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const slen = searchParams.get("len");
    let parsedLen = slen ? parseInt(slen) : 16;
    if (isNaN(parsedLen)) {
        parsedLen = 16;
    } else if (parsedLen < 4) {
        parsedLen = 4;
    } else if (parsedLen > 20) {
        parsedLen = 20;
    }
    let formattedLen = new Intl.NumberFormat(i18n.language).format(parsedLen);
    if (formattedLen.length < 2) {
        formattedLen = '\u00a0' + formattedLen;
    }

	const currentLocale = i18n.language;
	const ifRandom = searchParams.get("random") === "1";

    //const [len, setLen] = React.useState(parsedLen);

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
        Track('page', 'view', 'settings');
        (theDialog as HTMLDialogElement).showModal();
    };

    const handleClose = () => {
        setAnchorEl(null);
        const theDialog = document.getElementById("settings-dialog")
        if (!theDialog) {
            console.log("Null menu!?!");
            return;
        }
        Track('page', 'close', 'settings');
        (theDialog as HTMLDialogElement).close();
    };



    const localeComparator = (a: string, b: string) => t(`settings_locale_${a}`).localeCompare(t(`settings_locale_${b}`));
    const sortedLocales = [...locales].sort(localeComparator);

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
                <div className="modal-box w-90 flex flex-col gap-0 p-0">
                    <span className="p-3 text-xl font-bold border-b border-neutral/50">{t('settings')}</span>

                    <div className="p-3">
                        <div className="font-bold pb-2">{t('settings_length')}</div>
                        <div className="flex flex-row items-center ps-3 gap-3">
                            <span className="font-mono whitespace-nowrap">{formattedLen}</span>
                        <input id="test" type="range" min="4" max="20" value={parsedLen} className="range [--range-fill:0]"
                        onChange={(e) => {
                            Track('settings', 'length', `len=${e.target.value}`);

                            setSearchParams((p) => {
                                if (parseInt(e.target.value) == 16 ) {
                                    p.delete("len");
                                } else {
                                    p.set("len", e.target.value);
                                }
                                return p;
                            });
                        }}
                        />
                        </div>
                    </div>

                    <div className="p-3">
                        <div className="font-bold pb-2">{t('settings_example')}</div>

                            <div className="flex flex-row items-center ps-4 pb-1"
                                onClick={() => {
                                    Track('settings', 'fill', 'random');
                                    setSearchParams((p) => {
                                        p.set("random", "1");
                                        return p;
                                    });
                                }}
                            >
								<input type="radio" className="radio radio-xs me-2" readOnly checked={ifRandom} />
                                {t('settings_example_random')}
                            </div>
                            <div className="flex flex-row items-center ps-4 pb-1"
                                onClick={() => {
                                    Track('settings', 'fill', 'same');
                                    setSearchParams((p) => {
                                        p.delete("random");
                                        return p;
                                    });
                                }}
                            >
								<input type="radio" className="radio radio-xs me-2" readOnly checked={!ifRandom} />
                                {t('settings_example_same')}
                            </div>
                    </div>

                    <div className="p-3">
                        <div className="font-bold pb-2">{t('settings_locale')}</div>
                        {sortedLocales.map((locale) => (
                            <div
                                className="flex flex-row items-center ps-4 pb-1"
                                key={locale}
                                onClick={() => {
                                    Track('settings', 'locale', locale);
                                    i18n.changeLanguage(locale);
                                    Cookies.set('locale', locale, { expires: 365 });
                                }}
                            >
								<input type="radio" className="radio radio-xs me-2" readOnly checked={locale === currentLocale} />
                                {t(`settings_locale_${locale}`)}
                            </div>
                        ))}
                    </div>

                    <div className="p-3">
                        <div className="font-bold pb-2">{t('settings_mode')}</div>
                        {modeItems.map((option) => (
                        <div
                            className="flex flex-row items-center ps-4 pb-1"
                            key={option.value}
                            onClick={() => {
                                Track('settings', 'mode', option.value);
                                setMode(option.value);
                                saveMode(option.value);
                            }}
                            >
                            <option.icon className={`border-2 border-solid rounded-md ${option.value == currentMode ? 'border-current' : 'border-transparent'}`} size={24}/>
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
                            className="btn btn-fiserv w-full"
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
