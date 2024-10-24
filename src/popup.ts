document.addEventListener('DOMContentLoaded', () => {
    const applyButton = document.getElementById('applyFilters') as HTMLButtonElement;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    applyButton.addEventListener('click', () => {
        const selectedFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        chrome.runtime.sendMessage({ type: 'setFilters', filters: selectedFilters });
    });
});