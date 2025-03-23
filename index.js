function speakWord(word) {
  const synth = window.speechSynthesis;
    const wordElements = document.querySelectorAll('.word');

 wordElements.forEach(element =>{
    if(element.dataset.text === word){
     const text = element.dataset.text;
      const utterance = new SpeechSynthesisUtterance(text);
       utterance.lang = 'en-US'; // Устанавливаем английский язык

     // Выбор голоса (стараемся выбрать голос для английского языка)
      const englishVoice =  synth.getVoices().find(voice => voice.lang === 'en-US');

         if(englishVoice){
           utterance.voice = englishVoice;
         }

       synth.speak(utterance);
    }
 })
}

document.addEventListener('DOMContentLoaded', () => {
            const englishWordInput = document.getElementById('englishWord');
            const translationInput = document.getElementById('translation');
            const imageUploadInput = document.getElementById('imageUpload');
            const saveCategoryButton = document.getElementById('saveCategoryButton');
            const customCardContainer = document.getElementById('customCardContainer');

            const localStorageKey = 'customCategories'; // Ключ для localStorage
            let customCategories = [];

            // Функция для загрузки категорий из localStorage
            function loadCategories() {
                const storedCategories = localStorage.getItem(localStorageKey);
                if (storedCategories) {
                    customCategories = JSON.parse(storedCategories);
                    customCategories.forEach(category => {
                        addCard(category.englishWord, category.translation, category.image);
                    });
                }
            }

            // Функция для сохранения категорий в localStorage
            function saveCategories() {
                localStorage.setItem(localStorageKey, JSON.stringify(customCategories));
            }

            // Функция для создания и добавления карточки
            function addCard(englishWord, translation, imageURL) {
                const card = document.createElement('div');
                card.classList.add('custom-card');

                if (imageURL) {
                    const img = document.createElement('img');
                    img.src = imageURL;
                    img.alt = englishWord;
                    card.appendChild(img);
                }

                const englishWordElem = document.createElement('p');
                englishWordElem.textContent = englishWord;
                card.appendChild(englishWordElem);

                const translationElem = document.createElement('p');
                translationElem.textContent = translation;
                card.appendChild(translationElem);

                // Кнопка "Удалить"
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'X';  // Используем X для краткости
                deleteButton.addEventListener('click', () => {
                    deleteCategory(card, englishWord, translation, imageURL); // Вызываем функцию удаления
                });
                card.appendChild(deleteButton);

                customCardContainer.appendChild(card);
            }

            // Функция для удаления категории
            function deleteCategory(card, englishWord, translation, imageURL) {
                // Находим индекс категории в массиве
                const index = customCategories.findIndex(category =>
                    category.englishWord === englishWord &&
                    category.translation === translation &&
                    category.image === imageURL
                );

                if (index !== -1) {
                    customCategories.splice(index, 1); // Удаляем элемент из массива
                    saveCategories();  // Сохраняем обновленный массив в localStorage
                    card.remove(); // Удаляем карточку из DOM
                }
            }

            // Обработчик клика на кнопку "Добавить"
            saveCategoryButton.addEventListener('click', () => {
                const englishWord = englishWordInput.value.trim();
                const translation = translationInput.value.trim();
                const imageFile = imageUploadInput.files[0];

                if (!englishWord || !translation) {
                    alert('Пожалуйста, заполните все поля.');
                    return;
                }

                // Читаем изображение в Data URL
                let imageURL = null;
                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imageURL = e.target.result; // Получаем Data URL

                        // Создаем новый объект категории
                        const newCategory = {
                            englishWord: englishWord,
                            translation: translation,
                            image: imageURL
                        };

                        customCategories.push(newCategory);
                        saveCategories();
                        addCard(englishWord, translation, imageURL);

                        // Очищаем форму
                        englishWordInput.value = '';
                        translationInput.value = '';
                        imageUploadInput.value = '';
                    };
                    reader.readAsDataURL(imageFile); // Запускаем чтение файла
                } else {
                    // Если изображение не загружено
                    const newCategory = {
                        englishWord: englishWord,
                        translation: translation,
                        image: null
                    };
                    customCategories.push(newCategory);
                    saveCategories();
                    addCard(englishWord, translation, null);
                     // Очищаем форму
                    englishWordInput.value = '';
                    translationInput.value = '';
                    imageUploadInput.value = '';
                }
            });

            // Загружаем сохраненные категории при загрузке страницы
            loadCategories();
        });