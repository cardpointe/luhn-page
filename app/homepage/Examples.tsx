import { Trans, useTranslation } from 'react-i18next';
import { PiClipboardFill } from "react-icons/pi";

import { Link, useSearchParams } from "react-router";

import { luhnCheck } from "./luhnCheck";

function luhnGenerate(len: number, filler: () => string, num: string) {
    if (num.length > len - 1) {
        num = num.slice(0, len - 1);
    } else if (num.length < len - 1) {
        while (num.length < len - 1) {
            num += filler();
        }
    }
    for (let i = 0; i < 10; i++) {
        if (luhnCheck(num + i.toString())) {
            return num + i.toString();
        }
    }
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
    const { t, i18n } = useTranslation();

    let examples: string[] = [];

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
        let newNum: string;
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
    }

    return (
        <>
            <ul className="">
                {examples.map((n) => (
                    <li key={n} className="my-1 font-mono">
                        <button className="flex items-center border border-dotted rounded-md gap-2 p-2 border-base-content/50" onClick={() => {
                            if (!navigator.clipboard) {
                                document.getElementById("clipboard-error")?.classList.remove("hidden");
                                setTimeout(() => {
                                    document.getElementById("clipboard-error")?.classList.add("hidden");
                                }, 2000);
                                return;
                            }
                            navigator.clipboard.writeText(n);
                            document.getElementById("clipboard-success")?.classList.remove("hidden");
                            setTimeout(() => {
                                document.getElementById("clipboard-success")?.classList.add("hidden");
                            }
                            , 1500);
                        }}>
                            {n} <PiClipboardFill size={24} className="inline" />
                        </button>
                    </li>
                ))}
            </ul>
            <div className="toast toast-center">
                <div id="clipboard-error" className="alert alert-error hidden">
                    <span>{t('clipboard_error')}</span>
                </div>
                <div id="clipboard-success" className="alert alert-success hidden">
                    <span>{t('clipboard_success')}</span>
                </div>
            </div>
        </>
    )
}
