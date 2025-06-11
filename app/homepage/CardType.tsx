import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

type CardType = {
    name: string;
    prefix: RegExp;
    logo: string;
    samplePrefixes: string[];
};



const cardtypes = [
    { name: "Visa", prefix: new RegExp("^4"), logo: "/images/visa.svg", samplePrefixes: ["4"]},
    { name: "MasterCard", prefix: RegExp("^5[1-5]"), logo: "/images/mastercard.svg",  samplePrefixes: ["51", "52", "53"] },
    { name: "American Express", prefix: RegExp("^3[47]"), logo: "/images/amex.svg", samplePrefixes: ["34", "37"] },
    { name: "Discover", prefix: RegExp("^6(011|5)"), logo: "/images/discover.svg",  samplePrefixes: ["6011", "65"] },
    { name: "Diners Club", prefix: RegExp("^3[068]"), logo: "/images/dinersclub.svg",  samplePrefixes: ["30", "36", "38"] },
    { name: "JCB", prefix: RegExp("^35"), logo: "/images/jcb.svg",  samplePrefixes: ["35"] },
];

export function getCardType(number: string | null): CardType | null {
    if (!number || number.length == 0) {
        return null;
    }
    for (const card of cardtypes) {
        if (card.prefix.test(number)) {
            return card;
        }
    }
    return null;
}

export function CardType({ target, clickable }: { target: string | null, clickable?: boolean }) {
    const cardType = getCardType(target);
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const logo = cardType ? cardType.logo : "/images/unknown.svg";
    const text = cardType ? cardType.name : t("card_unknown");
    const clickFn = clickable && cardType ? () => {
        const prefixes = cardType.samplePrefixes;
        const prefix = prefixes.length > 0 ? prefixes[Math.floor(Math.random() * prefixes.length)] : "";
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("n", prefix);
            return newParams;
        })} : undefined;

    return (
            <>
                <img className="ms-2" src={logo} alt={text} style={{ "height": "2em" }} />
                <span className={`ms-2${clickFn ? " link": ""}`} onClick={clickFn}>{text}</span>
            </>
        );
    }

