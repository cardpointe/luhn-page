import { useState } from "react";
import { PiGear } from "react-icons/pi";
import { Trans, useTranslation } from 'react-i18next';

import { Link, useSearchParams } from "react-router";

import { Examples } from "./Examples";
import { luhnCheck } from "./luhnCheck";
import { Settings } from "./settings";


export function HomePage() {

    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const slen = searchParams.get("len");
    let len = slen ? parseInt(slen) : 16;
    if (isNaN(len)) {
        len = 16;
    } else if (len < 4) {
        len = 4;
    } else if (len > 20) {
        len = 20;
    }
    const srandom = searchParams.get("random");
    const random = srandom ? srandom === "1" : false;

    const target = searchParams.get("n") ?? "";
    let hint = "";
    let hintColor = "";
    let inputColor = "";
    if (target.length == 0) {
        hint = t('empty_hint', { len });
        hintColor = "text-base-content/50";
    } else if (target.length < len) {
        hint = t('err_too_short', { len });
        hintColor = "text-error";
        inputColor = "input-error";
    } else if (target.length > len) {
        hint = t('err_too_long', { len });
        hintColor = "text-error";
        inputColor = "input-error";
    } else if (luhnCheck(target)) {
        hint = t('valid_luhn');
        hintColor = "text-success";
        inputColor = "input-success";
    } else {
        hint = t('err_not_luhn');
        hintColor = "text-error";
        inputColor = "input-error";
    }

    return (
        <div className="h-dvh bg-base-100 flex flex-col">
            <div className="flex justify-center border-b border-neutral/10">
                <div className="max-w-3xl navbar bg-base-100">
                    <div className="flex-1 flex items-center ps-2">
                        <img src="/logo.svg" alt="logo" className="h-10 inline" />
                        <span className="ps-4 font-bold text-xl">{t('title')}</span>
                    </div>
                    <Settings />
                </div>
            </div>
            <div className="flex flex-col grow justify-center items-center pb-7">

                <div className="max-w-xl px-6">

                    <div role="alert" className="alert mt-2 mb-6 block">
                        <Trans
                            i18nKey="about"
                            components={{ WikipediaLink: <a className="link link-primary" href={t('wikipedia_link')} /> }}
                        />
                    </div>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">{t('prompt')}</legend>
                        <input
                            type="number"
                            className={`focus:outline-none input ${inputColor}`}
                            placeholder={t('placeholder')}
                            value={searchParams.get("n") ?? ""}
                            autoFocus
                            onChange={(e) => {
                                const n = e.target.value.replace(/\D/g, "");
                                if (n) {
                                    setSearchParams((p) => { p.set("n", n); return p });
                                } else {
                                    setSearchParams((p) => { p.delete("n"); return p });
                                }
                            }}
                        />
                        <p className={`label ${hintColor}`}>{hint}</p>
                    </fieldset>

                    <div role="alert" className="alert flex flex-col items-start mt-6 gap-0">
                        <Examples len={len} random={random} target={target} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-xs text-neutral/50 my-4">
                <Trans
                    i18nKey="footer"
                    components={{ DevLink: <a className="ps-1 font-bold" href='https://developer.fiserv.com/' /> }}
                />
            </div>
        </div>
    );
}