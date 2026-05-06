document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');

    // Fetch the JSON file
    fetch('./projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            renderProjects(data);
        })
        .catch(error => {
            grid.innerHTML = `
                <div class="loading error-message">
                    <h3>⚠️ No se pudieron cargar los proyectos</h3>
                    <p style="margin-top: 10px; font-size: 0.95rem;">
                        Si estás abriendo este archivo directamente en el navegador (con <code>file://</code>), 
                        es probable que el navegador esté bloqueando la carga del archivo JSON por políticas de seguridad (CORS).
                    </p>
                    <p style="margin-top: 10px; font-size: 0.95rem;">
                        <strong>Solución:</strong> Utilizá una extensión como "Live Server" en VSCode o iniciá un servidor local con Python/Node.js.
                    </p>
                </div>
            `;
            console.error('Error fetching projects:', error);
        });

    function renderProjects(projects) {
        grid.innerHTML = ''; // Clear loading message

        projects.forEach((project, index) => {
            // Parse tags
            const tags = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
            const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            // Format link
            let linkHTML = '';
            if (project.link && project.link !== 'null' && project.link !== '.' && project.link !== '-' && project.link !== 'NOP') {
                let href = project.link;
                if (!href.startsWith('http')) {
                    href = 'https://' + href;
                }
                // Clean up URLs that might have text in them (e.g. "https://url.com (quizás cambiamos)")
                const cleanHref = href.split(' ')[0];
                linkHTML = `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" class="project-link">Visitar Proyecto →</a>`;
            }

            // Clean up description
            const descriptionHTML = project.description ? project.description.replace(/\n/g, '<br>') : 'Sin descripción detallada.';

            // Create card element
            const card = document.createElement('div');
            card.className = 'project-card';
            // Stagger animation delay
            card.style.animationDelay = `${index * 0.05}s`;

            card.innerHTML = `
                <div class="project-type">${project.type || 'Proyecto'}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-brief">${project.brief}</p>
                
                <div class="desc-toggle-row">
                    <button class="desc-toggle-btn" aria-expanded="false">
                        Ver descripción completa
                        <span class="arrow">▼</span>
                    </button>
                    <div class="desc-wrapper">
                        <div class="desc-inner">
                            <div class="desc-text">${descriptionHTML}</div>
                        </div>
                    </div>
                </div>

                <div class="project-meta">
                    <div class="meta-item">
                        <span class="meta-label">Estudiantes</span>
                        <span class="meta-value">${project.students}</span>
                    </div>
                    <div class="meta-item" style="margin-top: 0.5rem;">
                        <span class="meta-label">Tutores</span>
                        <span class="meta-value">${project.tutors}</span>
                    </div>
                </div>

                <div class="project-tags">
                    ${tagsHTML}
                </div>

                ${linkHTML}
            `;

            grid.appendChild(card);

            // Accordion toggle
            const btn = card.querySelector('.desc-toggle-btn');
            const wrapper = card.querySelector('.desc-wrapper');
            btn.addEventListener('click', () => {
                const isOpen = wrapper.classList.toggle('open');
                btn.classList.toggle('open', isOpen);
                btn.setAttribute('aria-expanded', isOpen);
                btn.querySelector('.arrow').textContent = isOpen ? '▲' : '▼';
                btn.firstChild.textContent = isOpen ? 'Ocultar descripción ' : 'Ver descripción completa ';
            });
        });
    }
});
