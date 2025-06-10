export function luhnCheck(num: string) {
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
