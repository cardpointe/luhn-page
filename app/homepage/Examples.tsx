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

type PrefillType = {
    name: string,
    prefix: string,
    logo: string,
};

const prefills = [
//    { name: "Any", prefix: "", logo: "/images/any.svg" },
    { name: "Visa", prefix: "40", logo: "/images/visa.svg" },
    { name: "MasterCard", prefix: "51", logo: "/images/mastercard.svg" },
    { name: "American Express", prefix: "34", logo: "/images/amex.svg" },
    { name: "Discover", prefix: "6011", logo: "/images/discover.svg" },
//    { name: "JCB", prefix: "35", logo: "/images/jcb.svg" },
    { name: "Diners Club", prefix: "30", logo: "/images/dinersclub.svg" },
];

export function Examples({ len, target, random }: ExamplesProps) {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

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

    let fillDigit = examples.length;

    while (examples.length < 5) {
        let newNum: string;
        if (target.length == 0) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            newNum = luhnGenerate(len, random ? randomDigit : () => "0", prefix);
        } else {
            newNum = luhnGenerate(len, random ? randomDigit : () => (fillDigit).toString(), target);
            fillDigit++;
        }
        if (!examples.includes(newNum)) {
            examples.push(newNum);
        } else {
            console.log(`skipping dup ${newNum}`);
        }
    }

    return (
        <>
            <div className="flex rows items-center justify-between">
            {t('example_prompt')}
            { target.length == -1 && (
                <>
                {prefills.map((p: PrefillType) => (
                    <button key={p.prefix} className="btn btn-sm m-1" onClick={() => {
                        setSearchParams((params) => {
                            if (p.prefix) {
                                params.set("n", p.prefix);
                            } else {
                                params.delete("n");
                            }
                            return params;
                        });
                    }}>
                        <img src={p.logo} alt={p.name} className="h-6 inline" />
                    </button>
                ))}
                </>
            )}
            </div>
            <ul className="">
                {examples.map((n) => (
                    <li key={n} className="my-1 font-mono">
                        <button className="flex items-center border border-dotted rounded-md gap-2 p-2 border-base-content/50" onClick={() => {
                            try {
                                if (!navigator.clipboard) {
                                    const element = document.createElement("textarea");
                                    element.value = n;
                                    document.body.appendChild(element)
                                    element.select();
                                    document.execCommand("copy");
                                    document.body.removeChild(element);
                                } else {
                                    navigator.clipboard.writeText(n);
                                }
                                document.getElementById("clipboard-success")?.classList.remove("hidden");
                                setTimeout(() => {
                                    document.getElementById("clipboard-success")?.classList.add("hidden");
                                }
                                    , 1500);
                            } catch (e) {
                                document.getElementById("clipboard-error")?.classList.remove("hidden");
                                setTimeout(() => {
                                    document.getElementById("clipboard-error")?.classList.add("hidden");
                                }, 1500);
                            }
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
