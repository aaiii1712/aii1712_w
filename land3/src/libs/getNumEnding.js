/**
 * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
 * param  number Integer Число на основе которого нужно сформировать окончание
 * param  endingsArray  Array Массив слов или окончаний для чисел (1, 4, 5),
 *         например ['яблоко', 'яблока', 'яблок']
 * return String
 */
export function getNumEnding(number, endingArray) {
    let ending;
    number = number % 100;
    if (number >= 11 && number <= 19) {
        ending = endingArray[2];
    } else {
        switch (number % 10) {
            case (1):
                ending = endingArray[0];
                break;
            case (2):
            case (3):
            case (4):
                ending = endingArray[1];
                break;
            default:
                ending = endingArray[2];
        }
    }
    return ending;
}