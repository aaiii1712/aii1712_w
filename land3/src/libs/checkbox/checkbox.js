document.addEventListener('keydown', checkboxKeydownHandle)

function checkboxKeydownHandle(e) {
    const customCheckboxEl = e.target.closest('.i-checkbox__custom')

    if (!customCheckboxEl) return

    const pb = customCheckboxEl.closest('.i-checkbox')
    if (event.keyCode === 32 || event.keyCode === 13) {// Space or Enter
        pb?.querySelector('input[type=checkbox]').click();
        return false;
    }
}