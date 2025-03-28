function UCLN(a, b) {
    if (b == 0) return a;
    return UCLN(b, a % b);
}

console.log(UCLN(15, 21))