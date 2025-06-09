import { useState } from "react";
import { PiGear } from "react-icons/pi";
import { Trans, useTranslation } from 'react-i18next';

import { Link, useSearchParams } from "react-router";

import Settings from "./settings";

function luhnCheck(num: string) {
    let sum = 0;
    let alternate = false;

    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num.charAt(i), 10);
        if (alternate) {
            n *= 2;
            if (n > 9) {
                n -= 9;
            }
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 == 0;
}

function luhnGenerate(len: number, filler: () => string, num: string) {
    console.log(`luhnGenerate1(${len}, "${num}")`);
    if (num.length > len - 1) {
        num = num.slice(0, len - 1);
    } else if (num.length < len - 1) {
        while (num.length < len - 1) {
            num += filler();
        }
    }
    console.log(`luhnGenerate2(${len}, "${num}")`);
    for (let i = 0; i < 10; i++) {
        if (luhnCheck(num + i.toString())) {
            return num + i.toString();
        }
    }
    console.log(`Unable to generate valid number from "${num}" with length ${len}`);
    return "";
}

function randomDigit() {
    return Math.floor(Math.random() * 10).toString();
}

const prefixes = [
    "40", "42", "45", "48", // Visa
    "51", "52", "53", "54", "55", // MasterCard
    "34", "37", // American Express
    "6011", "65", // Discover
    "35", // JCB
    "30", "36", "38", // Diners Club
];

type ExamplesProps = {
    len: number,
    target: string,
    random: boolean,
}

export function Examples({ len, target, random }: ExamplesProps) {

    let examples:string[] = [];
    console.log(`strt len: ${examples.length}`);

    if (target.length >= len - 1) {
        const valid = luhnGenerate(len, () => "0", target);
        if (valid != target) {
            examples.push(valid);
        }
    }

    if (target.length >= len - 2) {
        target = target.slice(0, len - 3);
    }

    while (examples.length < 5) {
        let newNum:string;
        if (target.length == 0) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            newNum = luhnGenerate(len, random ? randomDigit : () => "0", prefix);
        } else {
            newNum = luhnGenerate(len, random ? randomDigit : () => (examples.length).toString(), target);
        }
        if (!examples.includes(newNum)) {
            examples.push(newNum);
        } else {
            console.log(`skipping dup ${newNum}`);
        }
        console.log(`incr len: ${examples.length} (${newNum})`);
    }
    console.log(`end len: ${examples.length} ${JSON.stringify(examples)} ${new Date().toISOString()}`);

    return (
        <ul className="">
            {examples.map((n) => (
                <li key={n} className="p-1 my-1 font-mono">{n}</li>
            ))}
        </ul>
    )
}


export function HomePage() {

    const { t, i18n } = useTranslation(); 
    const [searchParams, setSearchParams] = useSearchParams();

    const slen = searchParams.get("len");
    let len = slen ? parseInt(slen) : 16;
    if (len < 4) {
        len = 4;
    }
    const srandom = searchParams.get("random");
    const random = srandom ? srandom === "1" : false;

    const target = searchParams.get("n") ?? "";
    let hint = "";
    let hintColor = "";
    if (target.length == 0) {
        hint = t('empty_hint', { len });
        hintColor = "text-neutral/33";
    } else if (target.length < len) {
        hint = t('err_too_short', { len });
        hintColor = "text-error";
    } else if (target.length > len) {
        hint = t('err_too_long', { len });
        hintColor = "text-error";
    } else if (luhnCheck(target)) {
        hint = t('valid_luhn');
        hintColor = "text-success";
    } else {
        hint = t('err_not_luhn');
        hintColor = "text-error";
    }

    return (
        <div className="h-dvh bg-base-100 flex flex-col">
            <div className="flex justify-center border-b border-neutral/10">
                <div className="max-w-3xl navbar bg-base-100">
                    <div className="flex-1 flex items-center ps-2">
                        <img src="/logo.svg" alt="logo" className="h-10 inline" />
                        <a className="ps-2 font-bold text-xl" href="/about.html">{t('title')}</a>
                    </div>
                    <Settings />
                </div>
            </div>
            <div className="flex flex-col grow justify-center items-center pb-7">

                <div className="max-w-xl min-w-lg px-6">

                    <div role="alert" className="alert mb-6">
                        <span>{t('about')}</span>
                    </div>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">{t('prompt')}</legend>
                        <input
                            type="number"
                            className="input"
                            placeholder={t('placeholder')}
                            value={searchParams.get("n") ?? ""}
                            onChange={(e) => {
                                const n = e.target.value.replace(/\D/g, "");
                                if (n) {
                                    setSearchParams((p) => {p.set("n", n); return p});
                                } else {
                                    setSearchParams((p) => {p.delete("n"); return p});
                                }
                            }}
                        />
                        <p className={`label ${hintColor}`}>{hint}</p>
                    </fieldset>

                    <div role="alert" className="alert flex flex-col items-start mt-6 gap-0">
                        {t('example_prompt')}
                        <Examples len={len} random={random} target={target} />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-xs text-neutral/50 my-4">
            <Trans 
                i18nKey="footer"
                components={{ DevLink: <a className="px-1 font-bold" href='https://developer.fiserv.com/'/> }}
            />
            </div>
        </div>
    );
}