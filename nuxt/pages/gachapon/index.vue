<template>
    <div class="container">
        <header>
            <h1>Solo Leveling Gacha</h1>
        </header>

        <div class="gacha-machine">
            <div class="machine-top">
                <div class="machine-display" id="status-display">¡Listo para tirar!</div>
            </div>
            
            <div class="machine-body">
                <div class="item-display">
                    <div class="glow-effect" id="item-glow"></div>
                    <div class="gacha-orb" id="gacha-orb"></div>
                    <img src="/skins/skin-a.png" alt="Personaje" class="character-image" id="current-character">
                </div>
            </div>
            
            <div class="machine-bottom">
                <button class="pull-button" id="pull-button">TIRAR</button>
            </div>
        </div>

        <div class="slots-container" id="slots-container">
            <div class="slot active" data-slot="1">
                <div class="slot-label">Slot 1</div>
                <div class="slot-preview">
                    <img src="/skins/skin-a.png" alt="Slot 1" id="slot-preview-1">
                </div>
                <div class="equipped">EQUIPADO</div>
                <button class="equip-button" data-slot="1">Equipar</button>
            </div>
            
            <div class="slot" data-slot="2">
                <div class="slot-label">Slot 2</div>
                <div class="slot-preview">
                    <img src="/skins/skin-a.png" alt="Slot 2" id="slot-preview-2">
                </div>
                <div class="equipped">EQUIPADO</div>
                <button class="equip-button" data-slot="2">Equipar</button>
            </div>
            
            <div class="slot" data-slot="3">
                <div class="slot-label">Slot 3</div>
                <div class="slot-preview">
                    <img src="/skins/skin-a.png" alt="Slot 3" id="slot-preview-3">
                </div>
                <div class="equipped">EQUIPADO</div>
                <button class="equip-button" data-slot="3">Equipar</button>
            </div>
        </div>

        <div class="rarity-dropdown" id="rarity-dropdown">
            <div class="rarity-dropdown-header" id="rarity-dropdown-header">
                <div class="rarity-dropdown-title">Rarezas y Probabilidades</div>
                <div class="rarity-dropdown-arrow">▼</div>
            </div>
            <div class="rarity-dropdown-content">
                <table class="rarity-table">
                    <thead>
                        <tr>
                            <th>Rareza</th>
                            <th>Probabilidad</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="rarity-common">Común</td>
                            <td>50%</td>
                            <td>Cazadores de rango E y D</td>
                        </tr>
                        <tr>
                            <td class="rarity-rare">Raro</td>
                            <td>30%</td>
                            <td>Cazadores de rango C</td>
                        </tr>
                        <tr>
                            <td class="rarity-epic">Épico</td>
                            <td>15%</td>
                            <td>Cazadores de rango B</td>
                        </tr>
                        <tr>
                            <td class="rarity-legendary">Legendario</td>
                            <td>4%</td>
                            <td>Cazadores de rango A</td>
                        </tr>
                        <tr>
                            <td class="rarity-mythical">Mítico</td>
                            <td>1%</td>
                            <td>Cazadores de rango S</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="notification" id="notification"></div>

        <div class="footer">
            Solo Leveling Gacha Machine © 2025
        </div>
    </div>

    <!-- Overlay para oscurecer el fondo durante la animación -->
    <div class="overlay" id="overlay"></div>

    <!-- Popup de personaje -->
    <div class="character-popup" id="character-popup">
        <div class="popup-header">
            <h2 class="popup-title" id="popup-title">Nombre del Personaje</h2>
            <p class="popup-rarity" id="popup-rarity">Rareza</p>
            <div class="popup-close" id="popup-close">✕</div>
        </div>
        <div class="popup-content">
            <div class="popup-image-container">
                <div class="popup-image-glow" id="popup-image-glow"></div>
                <img src="/skins/skin-a.png" alt="Personaje" class="popup-image" id="popup-image">
            </div>
            <div class="popup-details">
                <div class="popup-description" id="popup-description">
                    Descripción del personaje y sus habilidades.
                </div>
                <div class="popup-stats">
                    <div class="stat-row">
                        <span class="stat-name">Fuerza</span>
                        <div class="stat-bar">
                            <div class="stat-fill" id="stat-strength" style="width: 70%; background-color: #ff5252;"></div>
                        </div>
                        <span id="strength-value">7/10</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">Agilidad</span>
                        <div class="stat-bar">
                            <div class="stat-fill" id="stat-agility" style="width: 85%; background-color: #4caf50;"></div>
                        </div>
                        <span id="agility-value">8.5/10</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">Magia</span>
                        <div class="stat-bar">
                            <div class="stat-fill" id="stat-magic" style="width: 50%; background-color: #2196f3;"></div>
                        </div>
                        <span id="magic-value">5/10</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="popup-buttons">
            <button class="popup-button" id="equip-button">Equipar</button>
            <button class="popup-button" id="close-button">Cerrar</button>
        </div>
    </div>
  
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Elementos del DOM
        const pullButton = document.getElementById('pull-button');
        const currentCharacter = document.getElementById('current-character');
        const statusDisplay = document.getElementById('status-display');
        const slotsContainer = document.getElementById('slots-container');
        const rarityDropdownHeader = document.getElementById('rarity-dropdown-header');
        const rarityDropdown = document.getElementById('rarity-dropdown');
        const notification = document.getElementById('notification');
        const itemGlow = document.getElementById('item-glow');
        const gachaOrb = document.getElementById('gacha-orb');
        const overlay = document.getElementById('overlay');
        const characterPopup = document.getElementById('character-popup');
        const popupClose = document.getElementById('popup-close');
        const closeButton = document.getElementById('close-button');
        const equipButton = document.getElementById('equip-button');

        // Personajes del gacha de Solo Leveling
        const characters = [
            {
                id: 1,
                name: "Sung Jin-Woo",
                rarity: "Mítico",
                image: "/skins/skin-a.png?text=Sung+Jin-Woo",
                description: "El protagonista principal que evoluciona de ser el cazador más débil a convertirse en el monarca de las sombras. Posee la habilidad única de nivelar y crear un ejército de sombras.",
                stats: {
                    strength: 9.5,
                    agility: 9.8,
                    magic: 9.7
                }
            },
            {
                id: 2,
                name: "Cha Hae-In",
                rarity: "Legendario",
                image: "/skins/skin-a.png?text=Cha+Hae-In",
                description: "Una poderosa cazadora de rango S conocida por su excelente sentido del olfato y habilidades con la espada. Es una de las mejores cazadoras en Corea.",
                stats: {
                    strength: 8.5,
                    agility: 9.0,
                    magic: 7.0
                }
            },
            {
                id: 3,
                name: "Choi Jong-In",
                rarity: "Legendario",
                image: "/skins/skin-a.png?text=Choi+Jong-In",
                description: "Presidente de la Asociación de Cazadores y conocido como 'El Hechicero'. Es considerado uno de los magos más poderosos del mundo.",
                stats: {
                    strength: 7.0,
                    agility: 7.5,
                    magic: 9.5
                }
            },
            {
                id: 4,
                name: "Go Gun-Hee",
                rarity: "Legendario",
                image: "/skins/skin-a.png?text=Go+Gun-Hee",
                description: "Presidente de la Asociación Coreana de Cazadores y uno de los primeros cazadores. A pesar de su edad, sigue siendo increíblemente fuerte.",
                stats: {
                    strength: 8.0,
                    agility: 7.0,
                    magic: 8.0
                }
            },
            {
                id: 5,
                name: "Baek Yoon-Ho",
                rarity: "Épico",
                image: "/skins/skin-a.png?text=Baek+Yoon-Ho",
                description: "Maestro del Gremio Lobo y cazador de rango S con la habilidad de transformarse en un hombre lobo. Posee gran fuerza física.",
                stats: {
                    strength: 8.5,
                    agility: 8.0,
                    magic: 5.0
                }
            },
            {
                id: 6,
                name: "Hwang Dong-Su",
                rarity: "Épico",
                image: "/skins/skin-a.png?text=Hwang+Dong-Su",
                description: "Hermano de Hwang Dong-Seok y cazador de rango S. Conocido por su temperamento violento y su poder destructivo.",
                stats: {
                    strength: 7.5,
                    agility: 7.0,
                    magic: 6.0
                }
            },
            {
                id: 7,
                name: "Min Byung-Gu",
                rarity: "Épico",
                image: "/skins/skin-a.png?text=Min+Byung-Gu",
                description: "Cazador de rango B que forma parte del equipo de Jin-Woo durante la mazmorra de doble calabozo.",
                stats: {
                    strength: 6.0,
                    agility: 6.5,
                    magic: 7.0
                }
            },
            {
                id: 8,
                name: "Lee Joohee",
                rarity: "Raro",
                image: "/skins/skin-a.png?text=Lee+Joohee",
                description: "Sanadora de rango C que sobrevivió junto a Jin-Woo en la mazmorra de doble calabozo. Posee capacidades curativas.",
                stats: {
                    strength: 3.0,
                    agility: 5.0,
                    magic: 7.0
                }
            },
            {
                id: 9,
                name: "Song Chi-Yul",
                rarity: "Raro",
                image: "/skins/skin-a.png?text=Song+Chi-Yul",
                description: "Cazador de rango C que aparece en las primeras mazmorras. Tiene habilidades básicas de combate cuerpo a cuerpo.",
                stats: {
                    strength: 5.5,
                    agility: 5.0,
                    magic: 2.0
                }
            },
            {
                id: 10,
                name: "Cazador Novato",
                rarity: "Común",
                image: "/skins/skin-a.png?text=Cazador+Novato",
                description: "Un cazador sin experiencia que apenas comienza su carrera. Posee habilidades básicas de combate.",
                stats: {
                    strength: 3.0,
                    agility: 3.0,
                    magic: 2.0
                }
            },
            {
                id: 11,
                name: "Recluta",
                rarity: "Común",
                image: "/skins/skin-a.png?text=Recluta",
                description: "Un ciudadano normal que recientemente descubrió sus poderes. Aún no ha participado en ninguna mazmorra.",
                stats: {
                    strength: 2.0,
                    agility: 2.5,
                    magic: 1.5
                }
            }
        ];

        // Variables de estado
        let currentSlot = 1;
        let slots = {
            1: null,
            2: null,
            3: null
        };
        let equippedSlot = 1;

        // Inicializar slots
        function initSlots() {
            const slotElements = document.querySelectorAll('.slot');
            slotElements.forEach(slot => {
                slot.addEventListener('click', () => {
                    const slotNumber = parseInt(slot.dataset.slot);
                    setActiveSlot(slotNumber);
                });
            });

            const equipButtons = document.querySelectorAll('.equip-button');
            equipButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const slotNumber = parseInt(button.dataset.slot);
                    if (slots[slotNumber]) {
                        equipSlot(slotNumber);
                    } else {
                        showNotification("¡No hay nada para equipar en este slot!");
                    }
                });
            });
        }

        // Establecer slot activo
        function setActiveSlot(slotNumber) {
            currentSlot = slotNumber;
            
            // Actualizar UI de slots
            const slotElements = document.querySelectorAll('.slot');
            slotElements.forEach(slot => {
                if (parseInt(slot.dataset.slot) === slotNumber) {
                    slot.classList.add('active');
                } else {
                    slot.classList.remove('active');
                }
            });

            // Mostrar personaje en slot activo si existe
            if (slots[currentSlot]) {
                currentCharacter.src = slots[currentSlot].image;
                statusDisplay.textContent = `${slots[currentSlot].name} - ${slots[currentSlot].rarity}`;
                setGlowColor(slots[currentSlot].rarity);
            } else {
                currentCharacter.src = "/skins/skin-a.png";
                statusDisplay.textContent = "¡Listo para tirar!";
                itemGlow.style.opacity = "0";
            }
        }

        // Equipar slot
        function equipSlot(slotNumber) {
            if (!slots[slotNumber]) return;
            
            equippedSlot = slotNumber;
            
            // Actualizar UI para mostrar equipado
            const slotElements = document.querySelectorAll('.slot');
            slotElements.forEach(slot => {
                if (parseInt(slot.dataset.slot) === slotNumber) {
                    slot.classList.add('equipped-slot');
                } else {
                    slot.classList.remove('equipped-slot');
                }
            });
            
            showNotification(`¡${slots[slotNumber].name} equipado!`);
        }

        // Obtener personaje aleatorio basado en rareza
        function getRandomCharacter() {
            const randomValue = Math.random() * 100;
            let rarityPool;
            
            if (randomValue <= 1) {
                rarityPool = characters.filter(char => char.rarity === "Mítico");
            } else if (randomValue <= 5) {
                rarityPool = characters.filter(char => char.rarity === "Legendario");
            } else if (randomValue <= 20) {
                rarityPool = characters.filter(char => char.rarity === "Épico");
            } else if (randomValue <= 50) {
                rarityPool = characters.filter(char => char.rarity === "Raro");
            } else {
                rarityPool = characters.filter(char => char.rarity === "Común");
            }
            
            // Si no hay personajes de esa rareza, usar cualquiera
            if (rarityPool.length === 0) {
                rarityPool = characters;
            }
            
            return rarityPool[Math.floor(Math.random() * rarityPool.length)];
        }

        // Mostrar notificación
        function showNotification(message) {
            notification.textContent = message;
            notification.style.opacity = "1";
            
            setTimeout(() => {
                notification.style.opacity = "0";
            }, 3000);
        }

        // Configurar efecto de brillo basado en rareza
        function setGlowColor(rarity) {
            let color;
            let opacity;
            
            switch (rarity) {
                case "Mítico":
                    color = "var(--mythical)";
                    opacity = "0.7";
                    break;
                case "Legendario":
                    color = "var(--legendary)";
                    opacity = "0.6";
                    break;
                case "Épico":
                    color = "var(--epic)";
                    opacity = "0.5";
                    break;
                case "Raro":
                    color = "var(--rare)";
                    opacity = "0.4";
                    break;
                default:
                    color = "white";
                    opacity = "0.3";
            }
            
            itemGlow.style.boxShadow = `0 0 30px ${color}`;
            itemGlow.style.opacity = opacity;
            
            return color;
        }

        // Crear fuegos artificiales para rarezas épicas o superiores
        function createFireworks(rarity) {
            if (rarity === "Común" || rarity === "Raro") return;
            
            let count;
            let color;
            
            switch (rarity) {
                case "Mítico":
                    count = 30;
                    color = "var(--mythical)";
                    break;
                case "Legendario":
                    count = 20;
                    color = "var(--legendary)";
                    break;
                default: // Épico
                    count = 10;
                    color = "var(--epic)";
            }
            
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const firework = document.createElement('div');
                    firework.className = 'firework';
                    firework.style.backgroundColor = color;
                    firework.style.boxShadow = `0 0 10px ${color}`;
                    
                    // Posición aleatoria alrededor de la pantalla
                    const top = Math.random() * window.innerHeight;
                    const left = Math.random() * window.innerWidth;
                    
                    firework.style.top = `${top}px`;
                    firework.style.left = `${left}px`;
                    firework.style.animation = `firework-animation ${1 + Math.random()}s ease-out forwards`;
                    
                    document.body.appendChild(firework);
                    
                    // Eliminar el elemento después de la animación
                    setTimeout(() => {
                        document.body.removeChild(firework);
                    }, 2000);
                }, i * 100);
            }
        }

        function pullAnimation(character) {
    return new Promise((resolve) => {
        // Activar orbe y overlay
        overlay.classList.add('active');
        gachaOrb.classList.add('active');
        
        // Añadir clase según rareza
        gachaOrb.className = 'gacha-orb active';
        
        let rarityClass;
        switch (character.rarity) {
            case "Mítico":
                rarityClass = "mythical";
                statusDisplay.textContent = "¡Aura increíblemente poderosa detectada!";
                break;
            case "Legendario":
                rarityClass = "legendary";
                statusDisplay.textContent = "¡Se detecta un aura muy poderosa!";
                break;
            case "Épico":
                rarityClass = "epic";
                statusDisplay.textContent = "¡Se detecta un aura poderosa!";
                break;
            case "Raro":
                rarityClass = "rare";
                statusDisplay.textContent = "¡Se detecta un aura interesante!";
                break;
            default:
                rarityClass = "common";
                statusDisplay.textContent = "Se detecta un aura...";
        }
        
        gachaOrb.classList.add(rarityClass);
        currentCharacter.style.opacity = "0";
        
        // Añadir clase de pulsación a item-display
        const itemDisplay = document.querySelector('.item-display');
        itemDisplay.className = `item-display pulse-${rarityClass}`;
        
        // Crear chispas alrededor del orbe
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const spark = document.createElement('div');
                spark.className = 'gacha-spark';
                
                // Tamaño aleatorio
                const size = 3 + Math.random() * 7;
                spark.style.width = `${size}px`;
                spark.style.height = `${size}px`;
                
                // Posición aleatoria alrededor del orbe
                const angle = Math.random() * Math.PI * 2;
                const distance = 70 + Math.random() * 30;
                const top = Math.sin(angle) * distance + 150;
                const left = Math.cos(angle) * distance + 150;
                
                spark.style.top = `${top}px`;
                spark.style.left = `${left}px`;
                
                // Color basado en rareza
                let sparkColor;
                switch (character.rarity) {
                    case "Mítico":
                        sparkColor = "var(--mythical)";
                        break;
                    case "Legendario":
                        sparkColor = "var(--legendary)";
                        break;
                    case "Épico":
                        sparkColor = "var(--epic)";
                        break;
                    case "Raro":
                        sparkColor = "var(--rare)";
                        break;
                    default:
                        sparkColor = "white";
                }
                
                spark.style.boxShadow = `0 0 5px ${sparkColor}`;
                spark.style.animation = `spark ${0.5 + Math.random()}s ease-out forwards`;
                
                gachaOrb.appendChild(spark);
                
                // Eliminar chispa después de la animación
                setTimeout(() => {
                    gachaOrb.removeChild(spark);
                }, 1500);
            }, i * 100);
        }
        
        // Mostrar resultado después de la animación
        setTimeout(() => {
            gachaOrb.className = 'gacha-orb'; // Resetear clases
            overlay.classList.remove('active');
            itemDisplay.className = 'item-display'; // Quitar animación de pulsación
            currentCharacter.src = character.image;
            currentCharacter.style.opacity = "1";
            currentCharacter.classList.add('pull-animation');
            statusDisplay.textContent = `¡${character.name} - ${character.rarity}!`;
            
            // Establecer brillo según rareza
            setGlowColor(character.rarity);
            
            // Remover clase de animación
            setTimeout(() => {
                currentCharacter.classList.remove('pull-animation');
                resolve();
            }, 1000);
        }, 2500);
    });
}

        // Mostrar popup de personaje
        function showCharacterPopup(character) {
            const popupTitle = document.getElementById('popup-title');
            const popupRarity = document.getElementById('popup-rarity');
            const popupImage = document.getElementById('popup-image');
            const popupImageGlow = document.getElementById('popup-image-glow');
            const popupDescription = document.getElementById('popup-description');
            const statStrength = document.getElementById('stat-strength');
            const statAgility = document.getElementById('stat-agility');
            const statMagic = document.getElementById('stat-magic');
            const strengthValue = document.getElementById('strength-value');
            const agilityValue = document.getElementById('agility-value');
            const magicValue = document.getElementById('magic-value');
            
            // Configurar datos del personaje
            popupTitle.textContent = character.name;
            popupRarity.textContent = character.rarity;
            popupImage.src = character.image;
            popupDescription.textContent = character.description;
            
            // Configurar estadísticas
            statStrength.style.width = `${character.stats.strength * 10}%`;
            statAgility.style.width = `${character.stats.agility * 10}%`;
            statMagic.style.width = `${character.stats.magic * 10}%`;
            
            strengthValue.textContent = `${character.stats.strength}/10`;
            agilityValue.textContent = `${character.stats.agility}/10`;
            magicValue.textContent = `${character.stats.magic}/10`;
            
            // Configurar color según rareza
            let color;
            switch (character.rarity) {
                case "Mítico":
                    color = "var(--mythical)";
                    popupRarity.className = "popup-rarity rarity-mythical";
                    break;
                case "Legendario":
                    color = "var(--legendary)";
                    popupRarity.className = "popup-rarity rarity-legendary";
                    break;
                case "Épico":
                    color = "var(--epic)";
                    popupRarity.className = "popup-rarity rarity-epic";
                    break;
                case "Raro":
                    color = "var(--rare)";
                    popupRarity.className = "popup-rarity rarity-rare";
                    break;
                default:
                    color = "white";
                    popupRarity.className = "popup-rarity rarity-common";
            }
            
            popupImageGlow.style.boxShadow = `0 0 30px ${color}`;
            
            // Mostrar popup
            overlay.classList.add('active');
            characterPopup.classList.add('active');
            createPopupParticles(character);
        }

        function createPopupParticles(character) {
    // Eliminar partículas existentes
    const existingParticles = document.querySelectorAll('.popup-particle');
    existingParticles.forEach(particle => particle.remove());
    
    const popupContent = document.querySelector('.popup-content');
    let particleColor;
    let particleCount;
    
    switch (character.rarity) {
        case "Mítico":
            particleColor = "var(--mythical)";
            particleCount = 25;
            break;
        case "Legendario":
            particleColor = "var(--legendary)";
            particleCount = 20;
            break;
        case "Épico":
            particleColor = "var(--epic)";
            particleCount = 15;
            break;
        case "Raro":
            particleColor = "var(--rare)";
            particleCount = 10;
            break;
        default:
            particleColor = "#ffffff";
            particleCount = 5;
    }
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'popup-particle';
        
        // Tamaño aleatorio
        const size = 2 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posición aleatoria
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        particle.style.top = `${top}%`;
        particle.style.left = `${left}%`;
        
        // Color y sombra
        particle.style.backgroundColor = particleColor;
        particle.style.boxShadow = `0 0 5px ${particleColor}`;
        
        // Duración de animación variable
        const duration = 2 + Math.random() * 3;
        particle.style.animationDuration = `${duration}s`;
        
        // Retraso aleatorio
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        popupContent.appendChild(particle);
    }
}

        // Evento de click para tirar gacha
        pullButton.addEventListener('click', async () => {
            pullButton.disabled = true;
            pullButton.textContent = "TIRANDO...";
            
            const character = getRandomCharacter();
            
            // Realizar animación
            await pullAnimation(character);
            
            // Guardar personaje en slot actual
            slots[currentSlot] = character;
            
            // Actualizar vista previa del slot
            const slotPreview = document.getElementById(`slot-preview-${currentSlot}`);
            if (slotPreview) {
                slotPreview.src = character.image;
            }
            
            // Añadir insignia de rareza al slot
            const slot = document.querySelector(`.slot[data-slot="${currentSlot}"]`);
            const existingBadge = slot.querySelector('.rarity-badge');
            if (existingBadge) {
                slot.removeChild(existingBadge);
            }
            
            const badge = document.createElement('div');
            badge.className = `rarity-badge rarity-${character.rarity.toLowerCase()}`;
            badge.textContent = character.rarity;
            slot.appendChild(badge);
            
            // Crear fuegos artificiales para rarezas altas
            createFireworks(character.rarity);
            
            // Mostrar notificación
            showNotification(`¡Has obtenido a ${character.name} (${character.rarity})!`);
            
            // Mostrar popup del personaje
            setTimeout(() => {
                showCharacterPopup(character);
            }, 1000);
            
            pullButton.disabled = false;
            pullButton.textContent = "TIRAR";
        });

        // Dropdown de rareza
        rarityDropdownHeader.addEventListener('click', () => {
            rarityDropdown.classList.toggle('open');
        });

        // Cerrar popup
        popupClose.addEventListener('click', () => {
            characterPopup.classList.remove('active');
            overlay.classList.remove('active');
        });

        closeButton.addEventListener('click', () => {
            characterPopup.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Equipar desde popup
        equipButton.addEventListener('click', () => {
            equipSlot(currentSlot);
            characterPopup.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Inicializar
        initSlots();

  // Todo el código de eventos, animaciones, slots, etc., lo pegas aquí.
});
</script>

<style>
        :root {
            --primary: #7636ff;
            --secondary: #1a1a2e;
            --highlight: #4b31b8;
            --text: #e6e6ff;
            --rare: #00c2ff;
            --epic: #bb00ff;
            --legendary: #ffaa00;
            --mythical: #ff0040;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0a0a1a;
            color: var(--text);
            overflow-x: hidden;
            background-image: linear-gradient(to bottom, #0a0a1a 0%, #12122a 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #202040 100%);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }

        h1 {
            font-size: 3em;
            text-transform: uppercase;
            margin: 0;
            text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);
            background: linear-gradient(to right, #7636ff, #c342ff, #7636ff);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from {
                text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);
            }
            to {
                text-shadow: 0 0 15px var(--primary), 0 0 30px var(--primary), 0 0 40px var(--primary);
            }
        }

        .gacha-machine {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 50px;
        }

        .machine-top {
            width: 400px;
            height: 100px;
            background: linear-gradient(to bottom, #383861 0%, #232342 100%);
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid #4b4b7c;
            border-bottom: none;
        }

        .machine-display {
            width: 350px;
            height: 60px;
            background: linear-gradient(to bottom, #101022 0%, #1a1a32 100%);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
            color: var(--text);
            text-shadow: 0 0 5px var(--primary);
            border: 1px solid #4b4b7c;
        }

        .machine-body {
            width: 400px;
            height: 400px;
            background: linear-gradient(to bottom, #232342 0%, #181830 100%);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid #4b4b7c;
        }

        .item-display {
            width: 300px;
            height: 300px;
            background: linear-gradient(135deg, #10101c 0%, #1a1a2e 100%);
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5), 0 0 10px rgba(118, 54, 255, 0.3);
            border: 1px solid #4b4b7c;
        }

        .character-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            transition: transform 0.5s ease;
            filter: drop-shadow(0 0 10px var(--primary));
            opacity: 1;
        }

        .machine-bottom {
            width: 400px;
            height: 100px;
            background: linear-gradient(to bottom, #181830 0%, #10101e 100%);
            border-radius: 0 0 20px 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid #4b4b7c;
            border-top: none;
        }

        .pull-button {
            width: 150px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--highlight) 100%);
            border: none;
            border-radius: 30px;
            color: white;
            font-size: 1.2em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(118, 54, 255, 0.5);
            position: relative;
            overflow: hidden;
            text-transform: uppercase;
        }

        .pull-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(118, 54, 255, 0.8);
        }

        .pull-button:active {
            transform: scale(0.95);
        }

        .pull-button::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(transparent, transparent, transparent, #ffffff);
            transform: rotate(45deg);
            transition: all 0.5s ease;
            opacity: 0;
        }

        .pull-button:hover::after {
            opacity: 0.15;
            transform: rotate(45deg) translate(50%, 50%);
        }

        .slots-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
            margin-bottom: 30px;
        }

        .slot {
            width: 120px;
            height: 170px;
            background: linear-gradient(135deg, #1a1a2e 0%, #282850 100%);
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 2px solid #4b4b7c;
            padding: 10px;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            cursor: pointer;
        }

        .slot.active {
            border: 2px solid var(--primary);
            box-shadow: 0 0 15px var(--primary);
        }

        .slot-preview {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #10101c 0%, #1a1a2e 100%);
            border-radius: 5px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .slot-preview img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        .slot-label {
            font-size: 1em;
            color: var(--text);
            margin-bottom: 5px;
        }

        .equip-button {
            width: 80px;
            height: 30px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--highlight) 100%);
            border: none;
            border-radius: 15px;
            color: white;
            font-size: 0.8em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 5px rgba(118, 54, 255, 0.5);
        }

        .equip-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(118, 54, 255, 0.8);
        }

        .equip-button:active {
            transform: scale(0.95);
        }

        .slot:first-child::after {
            content: 'GRATIS';
            position: absolute;
            top: -10px;
            right: -10px;
            background: linear-gradient(135deg, #ff4d4d 0%, #ff1a1a 100%);
            color: white;
            padding: 5px 10px;
            font-size: 0.7em;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 0 5px rgba(255, 77, 77, 0.5);
            transform: rotate(15deg);
        }

        .rarity-dropdown {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a2e 0%, #282850 100%);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 40px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid #4b4b7c;
            transition: all 0.3s ease;
        }

        .rarity-dropdown-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding-bottom: 10px;
            border-bottom: 1px solid #4b4b7c;
        }

        .rarity-dropdown-title {
            font-size: 1.5em;
            font-weight: bold;
            color: var(--text);
            text-shadow: 0 0 5px var(--primary);
        }

        .rarity-dropdown-arrow {
            font-size: 1.5em;
            transition: transform 0.3s ease;
        }

        .rarity-dropdown-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease;
        }

        .rarity-dropdown.open .rarity-dropdown-content {
            max-height: 1000px;
        }

        .rarity-dropdown.open .rarity-dropdown-arrow {
            transform: rotate(180deg);
        }

        .rarity-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .rarity-table th, .rarity-table td {
            padding: 10px 15px;
            text-align: left;
            border-bottom: 1px solid #4b4b7c;
        }

        .rarity-table th {
            color: var(--text);
            font-weight: bold;
            background-color: rgba(75, 49, 184, 0.2);
        }

        .rarity-table tr:last-child td {
            border-bottom: none;
        }

        .rarity-common {
            color: #ffffff;
        }

        .rarity-rare {
            color: var(--rare);
            text-shadow: 0 0 5px var(--rare);
        }

        .rarity-epic {
            color: var(--epic);
            text-shadow: 0 0 5px var(--epic);
        }

        .rarity-legendary {
            color: var(--legendary);
            text-shadow: 0 0 5px var(--legendary);
        }

        .rarity-mythical {
            color: var(--mythical);
            text-shadow: 0 0 5px var(--mythical);
        }

        .firework {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        }

        @keyframes firework-animation {
            0% {
                opacity: 1;
                transform: scale(0.1);
            }
            50% {
                opacity: 0.8;
            }
            100% {
                opacity: 0;
                transform: scale(2);
            }
        }

        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary) 0%, var(--highlight) 100%);
            color: var(--text);
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 1.2em;
            box-shadow: 0 0 20px rgba(118, 54, 255, 0.8);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            text-align: center;
            min-width: 300px;
            font-weight: bold;
        }

        .glow-effect {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(118, 54, 255, 0.8);
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none;
        }

        .pull-animation {
            animation: pull 1s ease-in-out;
        }
                /* Estilos para las partículas del popup */
        .popup-particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.7;
            animation: float-particle 3s ease-in-out infinite;
        }

        @keyframes float-particle {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.3;
            }
            100% {
                transform: translateY(0) rotate(360deg);
                opacity: 0.7;
            }
        }

        /* Animación para el orbe gacha según rareza */
        .gacha-orb.common {
            background: radial-gradient(circle at 30% 30%, #ffffff, #cccccc 60%, #999999);
            box-shadow: 0 0 50px #cccccc, inset 0 0 30px rgba(255, 255, 255, 0.8);
        }

        .gacha-orb.rare {
            background: radial-gradient(circle at 30% 30%, #ffffff, var(--rare) 60%, #0077aa);
            box-shadow: 0 0 50px var(--rare), inset 0 0 30px rgba(255, 255, 255, 0.8);
        }

        .gacha-orb.epic {
            background: radial-gradient(circle at 30% 30%, #ffffff, var(--epic) 60%, #7700aa);
            box-shadow: 0 0 50px var(--epic), inset 0 0 30px rgba(255, 255, 255, 0.8);
        }

        .gacha-orb.legendary {
            background: radial-gradient(circle at 30% 30%, #ffffff, var(--legendary) 60%, #aa7700);
            box-shadow: 0 0 50px var(--legendary), inset 0 0 30px rgba(255, 255, 255, 0.8);
        }

        .gacha-orb.mythical {
            background: radial-gradient(circle at 30% 30%, #ffffff, var(--mythical) 60%, #aa0022);
            box-shadow: 0 0 50px var(--mythical), inset 0 0 30px rgba(255, 255, 255, 0.8);
        }

        /* Pulsación según rareza */
        @keyframes pulse-common {
            0% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
            50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.8); }
            100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
        }

        @keyframes pulse-rare {
            0% { box-shadow: 0 0 20px rgba(0, 194, 255, 0.5); }
            50% { box-shadow: 0 0 40px rgba(0, 194, 255, 0.8); }
            100% { box-shadow: 0 0 20px rgba(0, 194, 255, 0.5); }
        }

        @keyframes pulse-epic {
            0% { box-shadow: 0 0 20px rgba(187, 0, 255, 0.5); }
            50% { box-shadow: 0 0 40px rgba(187, 0, 255, 0.8); }
            100% { box-shadow: 0 0 20px rgba(187, 0, 255, 0.5); }
        }

        @keyframes pulse-legendary {
            0% { box-shadow: 0 0 20px rgba(255, 170, 0, 0.5); }
            50% { box-shadow: 0 0 40px rgba(255, 170, 0, 0.8); }
            100% { box-shadow: 0 0 20px rgba(255, 170, 0, 0.5); }
        }

        @keyframes pulse-mythical {
            0% { box-shadow: 0 0 20px rgba(255, 0, 64, 0.5); }
            50% { box-shadow: 0 0 40px rgba(255, 0, 64, 0.8); }
            100% { box-shadow: 0 0 20px rgba(255, 0, 64, 0.5); }
        }

        .item-display.pulse-common {
            animation: pulse-common 1.5s infinite;
        }

        .item-display.pulse-rare {
            animation: pulse-rare 1.5s infinite;
        }

        .item-display.pulse-epic {
            animation: pulse-epic 1.5s infinite;
        }

        .item-display.pulse-legendary {
            animation: pulse-legendary 1.5s infinite;
        }

        .item-display.pulse-mythical {
            animation: pulse-mythical 1.5s infinite;
        }

        @keyframes pull {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }

        .equipped {
            position: absolute;
            bottom: 45px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 200, 0, 0.8);
            color: white;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 0.7em;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .slot.equipped-slot .equipped {
            opacity: 1;
        }

        .rarity-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.7em;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.7);
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 0.9em;
            color: rgba(230, 230, 255, 0.7);
            border-top: 1px solid #4b4b7c;
            margin-top: 30px;
        }

        /* Nuevos estilos para la animación de la bola gacha */
        .gacha-orb {
            position: absolute;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle at 30% 30%, #ffffff, var(--primary) 60%, #2b1867);
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.5s ease;
            box-shadow: 0 0 50px var(--primary), inset 0 0 30px rgba(255, 255, 255, 0.8);
            z-index: 10;
            display: none;
        }

        .gacha-orb.active {
            display: block;
            opacity: 1;
            animation: orbFloat 2s ease-in-out infinite alternate, orbRotate 3s linear infinite;
        }

        @keyframes orbFloat {
            0% {
                transform: translateY(0) scale(1);
            }
            100% {
                transform: translateY(-20px) scale(1.1);
            }
        }

        @keyframes orbRotate {
            0% {
                background: radial-gradient(circle at 30% 30%, #ffffff, var(--primary) 60%, #2b1867);
            }
            33% {
                background: radial-gradient(circle at 70% 30%, #ffffff, var(--primary) 60%, #2b1867);
            }
            66% {
                background: radial-gradient(circle at 70% 70%, #ffffff, var(--primary) 60%, #2b1867);
            }
            100% {
                background: radial-gradient(circle at 30% 70%, #ffffff, var(--primary) 60%, #2b1867);
            }
        }

        .gacha-spark {
            position: absolute;
            background: white;
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            z-index: 11;
        }

        @keyframes spark {
            0% {
                opacity: 0;
                transform: scale(0.1) rotate(0deg);
            }
            50% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: scale(1.5) rotate(180deg);
            }
        }

        /* Overlay para oscurecer el fondo durante la animación */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9;
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .overlay.active {
            display: block;
            opacity: 1;
        }

        /* Estilos para el popup */
        .character-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            width: 80%;
            max-width: 500px;
            background: linear-gradient(135deg, #1a1a2e 0%, #282850 100%);
            border-radius: 15px;
            border: 3px solid var(--primary);
            padding: 30px;
            z-index: 20;
            display: none;
            opacity: 0;
            transition: all 0.5s ease;
            box-shadow: 0 0 50px rgba(118, 54, 255, 0.5);
        }

        .character-popup.active {
            display: block;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        .popup-header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
        }

        .popup-title {
            font-size: 2em;
            margin: 0;
            text-shadow: 0 0 10px var(--primary);
        }

        .popup-rarity {
            font-size: 1.2em;
            margin: 5px 0 0;
        }

        .popup-content {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .popup-image-container {
            flex: 0 0 40%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .popup-image {
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .popup-image-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            opacity: 0.7;
        }

        .popup-details {
            flex: 1;
        }

        .popup-description {
            margin-bottom: 20px;
            font-size: 1.1em;
            line-height: 1.5;
        }

        .popup-stats {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
        }

        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .stat-name {
            font-weight: bold;
        }

        .stat-bar {
            width: 60%;
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            overflow: hidden;
        }

        .stat-fill {
            height: 100%;
            border-radius: 5px;
            transition: width 1s ease;
        }

        .popup-close {
            position: absolute;
            top: -15px;
            right: -15px;
            width: 30px;
            height: 30px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.2em;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            border: 2px solid white;
        }

        .popup-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }

        .popup-button {
            width: 120px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--highlight) 100%);
            border: none;
            border-radius: 20px;
            color: white;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .popup-button:hover {
            transform: scale(1.05);
        }
    </style>