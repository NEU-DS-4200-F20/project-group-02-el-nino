const valueToDate = value => {
    let date = "";
    if (!(value < 1) && !(value > 24)) {
        const year = value => value < 13 ? "2018-" : "2019-";
        const month = value => (((value - 1) % 12) + 1).toString().padStart(2, "0");
        date = date + year(value) + month(value);
    }
    return date;
}