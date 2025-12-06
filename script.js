    (function(){
        const btn = document.getElementById('tema-btn');
        if(!btn) return;
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) document.body.classList.add('oscuro');
        function updateText(){ btn.textContent = document.body.classList.contains('oscuro') ? 'Tema claro' : 'Tema oscuro'; }
        updateText();
        btn.addEventListener('click', () => {
            document.body.classList.toggle('oscuro');
            localStorage.setItem('theme', document.body.classList.contains('oscuro') ? 'dark' : 'light');
            updateText();
        });
    })();