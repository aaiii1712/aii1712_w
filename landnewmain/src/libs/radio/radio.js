document.addEventListener('keydown', radioKeydownHandle)

function radioKeydownHandle(e) {
    const customRadioEl = e.target.closest('.i-radio__custom')

    if (!customRadioEl) return

    const pb = customRadioEl.closest('.i-radio')
    if (event.keyCode === 32 || event.keyCode === 13) {// Space or Enter
        pb?.querySelector('input[type=radio]').click();
        return false;
    }
}