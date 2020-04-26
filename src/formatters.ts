export default class Formatters {
  static wholeNumberWithCommas(n: number): string {
    return new Intl.NumberFormat().format(Math.round(n));
  }
}
