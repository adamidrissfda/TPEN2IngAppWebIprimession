/**
 * ============================================================
 * TRAVAUX PRATIQUES INDIVIDUELS - UNIVERSITÉ DE NGAOUNDÉRÉ
 * Étudiant: ADAM IDRISS KESSOU - Matricule: 23B048FS
 * Cours: INF336 - Ingénierie des Applications Web
 * Enseignant: Ing. KOTVA Samuel
 * TPE N°2: Calcul TVA 17% & Multi-devises
 * ============================================================
 */

// ============================================================
// CONSTANTES
// ============================================================
const TAUX_TVA = 17; // TVA fixe à 17% selon l'énoncé

// Informations des devises (symboles et formatage)
const infoDevises = {
    'XAF': { symbole: 'FCFA', nom: 'Franc CFA BEAC', decimales: 0 },
    'XOF': { symbole: 'FCFA', nom: 'Franc CFA BCEAO', decimales: 0 },
    'NGN': { symbole: '₦', nom: 'Naira Nigérian', decimales: 0 },
    'ZAR': { symbole: 'R', nom: 'Rand Sud-Africain', decimales: 2 },
    'USD': { symbole: '$', nom: 'Dollar Américain', decimales: 2 },
    'CAD': { symbole: 'C$', nom: 'Dollar Canadien', decimales: 2 },
    'CNY': { symbole: '¥', nom: 'Yuan Chinois', decimales: 2 },
    'JPY': { symbole: '¥', nom: 'Yen Japonais', decimales: 0 },
    'INR': { symbole: '₹', nom: 'Roupie Indienne', decimales: 0 },
    'EUR': { symbole: '€', nom: 'Euro', decimales: 2 },
    'GBP': { symbole: '£', nom: 'Livre Sterling', decimales: 2 },
    'RUB': { symbole: '₽', nom: 'Rouble Russe', decimales: 2 }
};

// ============================================================
// INITIALISATION UI - CURSEUR RANGE
// ============================================================
const rangeSlider = document.getElementById('rangeSlider');
const rangeOutput = document.getElementById('rangeValue');

if (rangeSlider && rangeOutput) {
    const updateRange = () => {
        rangeOutput.textContent = rangeSlider.value + '%';
        const val = (rangeSlider.value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min) * 100;
        rangeSlider.style.background = `linear-gradient(90deg, #cc9900 ${val}%, rgba(255,255,255,0.2) ${val}%)`;
    };
    
    rangeSlider.addEventListener('input', updateRange);
    updateRange();
}

// ============================================================
// FORMATAGE DES MONTANTS SELON LA DEVISE
// ============================================================
function formaterMontant(montant, devise) {
    const info = infoDevises[devise] || { decimales: 0, symbole: devise };
    
    if (info.decimales === 0) {
        return Math.round(montant).toLocaleString('fr-FR');
    } else {
        return montant.toLocaleString('fr-FR', { 
            minimumFractionDigits: info.decimales, 
            maximumFractionDigits: info.decimales 
        });
    }
}

// ============================================================
// FONCTION PRINCIPALE : CALCUL TVA 17% (DANS LA DEVISE CHOISIE)
// ============================================================
function calculerTVA() {
    console.log('[TP-INF336] Exécution de calculerTVA() - TVA 17%');
    
    const inputPrix = document.getElementById('prixHT');
    const selectDevise = document.getElementById('deviseSelect');
    const inputReduction = document.getElementById('reduction');
    const btn = document.getElementById('btnCalculer');
    
    // Validation du prix
    const prixHT = parseFloat(inputPrix.value);
    
    if (isNaN(prixHT) || prixHT < 0) {
        alert('❌ Veuillez entrer un prix HT valide (nombre positif)');
        inputPrix.focus();
        return;
    }
    
    // Désactiver le bouton pendant le calcul
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calcul en cours...';
    
    // Récupération de la devise et de la réduction
    const devise = selectDevise.value;
    const infoDevise = infoDevises[devise];
    const symbole = infoDevise.symbole;
    const reduction = parseFloat(inputReduction.value) || 0;
    
    // Vérification de la réduction
    if (reduction < 0 || reduction > 100) {
        alert('❌ La réduction doit être comprise entre 0 et 100%');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-calculator"></i> Calculer la TVA (17%)';
        return;
    }
    
    // ============================================================
    // CALCULS
    // ============================================================
    const montantTVA = prixHT * (TAUX_TVA / 100);
    const prixTTC = prixHT + montantTVA;
    const montantReduction = prixTTC * (reduction / 100);
    const prixFinal = prixTTC - montantReduction;
    
    // Formatage des montants selon la devise
    const prixHTFormate = formaterMontant(prixHT, devise);
    const tvaFormate = formaterMontant(montantTVA, devise);
    const ttcFormate = formaterMontant(prixTTC, devise);
    const reductionFormate = formaterMontant(montantReduction, devise);
    const finalFormate = formaterMontant(prixFinal, devise);
    
    // ============================================================
    // AFFICHAGE DES RÉSULTATS
    // ============================================================
    
    // 1. Montant TVA
    document.getElementById('montantTVA').innerHTML = 
        `<i class="fas fa-calculator"></i> Montant TVA (17%): <strong>${tvaFormate} ${symbole}</strong>`;
    
    // 2. Prix TTC
    document.getElementById('prixTTC').innerHTML = 
        `<i class="fas fa-tag"></i> Prix TTC: <strong>${ttcFormate} ${symbole}</strong>`;
    
    // 3. Réduction (affichée seulement si > 0)
    const ligneReduction = document.getElementById('ligneReduction');
    if (reduction > 0) {
        ligneReduction.style.display = 'flex';
        document.getElementById('montantReduction').innerHTML = 
            `<i class="fas fa-tags"></i> Réduction (${reduction}%): <strong>-${reductionFormate} ${symbole}</strong>`;
    } else {
        ligneReduction.style.display = 'none';
    }
    
    // 4. Prix final
    document.getElementById('prixFinal').innerHTML = 
        `<i class="fas fa-check-circle"></i> Prix final: <strong>${finalFormate} ${symbole}</strong>`;
    
    // Réactiver le bouton
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-calculator"></i> Calculer la TVA (17%)';
    }, 300);
    
    // Retourner les résultats pour utilisation éventuelle
    return { 
        prixHT, 
        devise, 
        symbole, 
        montantTVA, 
        prixTTC, 
        reduction, 
        montantReduction, 
        prixFinal 
    };
}

// ============================================================
// FONCTION : VÉRIFICATION PRÉSENCE DANS ARRAY
// ============================================================
function verifierPresence() {
    console.log('[TP-INF336] Exécution de verifierPresence() - Recherche dans Array');
    
    // Tableau d'entiers fourni dans l'énoncé
    const monTableau = [10, 25, 42, 50, 88, 100];
    
    const inputNombre = document.getElementById('nombreCherche');
    const affichage = document.getElementById('resultatArray');
    
    const valeurBrute = inputNombre.value.trim();
    
    // Validation
    if (valeurBrute === '') {
        affichage.innerHTML = `<i class="fas fa-info-circle" style="color: #94a3b8;"></i> 
                               <span>Veuillez entrer un nombre entier.</span>`;
        affichage.style.borderLeftColor = '#94a3b8';
        inputNombre.focus();
        return false;
    }
    
    const nombre = parseInt(valeurBrute, 10);
    
    if (isNaN(nombre)) {
        affichage.innerHTML = `<i class="fas fa-info-circle" style="color: #94a3b8;"></i> 
                               <span>Veuillez entrer un nombre entier valide.</span>`;
        affichage.style.borderLeftColor = '#94a3b8';
        inputNombre.focus();
        return false;
    }
    
    // Algorithme de recherche (utilisation de includes())
    const existe = monTableau.includes(nombre);
    
    // Formatage du résultat
    const couleur = existe ? '#10b981' : '#ef4444';
    const icone = existe ? 'check-circle' : 'times-circle';
    const emoji = existe ? '✅' : '❌';
    
    affichage.innerHTML = `<i class="fas fa-${icone}" style="color: ${couleur};"></i> 
                           <span><strong>Résultat : ${existe}</strong> ${emoji} — 
                           Le nombre ${nombre} ${existe ? 'est présent' : 'n\'est pas présent'} 
                           dans l'array [${monTableau.join(', ')}]</span>`;
    affichage.style.borderLeftColor = couleur;
    
    // Retourne la valeur booléenne comme demandé
    return existe;
}

// ============================================================
// FONCTION : AFFICHAGE DATE DU JOUR (FORMAT LONG FR)
// ============================================================
function afficherDateJour() {
    console.log('[TP-INF336] Exécution de afficherDateJour()');
    
    const affichage = document.getElementById('dateAujourdhui');
    const btn = document.querySelector('button[onclick="afficherDateJour()"]');
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
    }
    
    // Création de la date
    const date = new Date();
    
    // Options de formatage pour le français
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateFormatee = date.toLocaleDateString('fr-FR', options);
    
    // Affichage avec animation
    affichage.innerHTML = `<i class="far fa-calendar-check" style="color: #cc9900;"></i> 
                           <span>Nous sommes le <strong>${dateFormatee}</strong></span>`;
    
    // Animation subtile
    affichage.style.transform = 'scale(1.02)';
    setTimeout(() => affichage.style.transform = 'scale(1)', 150);
    
    if (btn) {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="far fa-calendar-alt"></i> Afficher la date du jour';
        }, 300);
    }
}

// ============================================================
// VALIDATION DU FORMULAIRE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c[TP-INF336] Page chargée avec succès', 'color: #10b981; font-weight: bold;');
    console.log('👨‍🎓 Étudiant: ADAM IDRISS KESSOU - 23B048FS');
    console.log('👨‍🏫 Enseignant: Ing. KOTVA Samuel');
    console.log('📚 Cours: INF336 - Ingénierie des Applications Web');
    console.log('📅 TPE N°2: Calcul TVA 17% & Multi-devises');
    
    const formulaire = document.getElementById('monFormulaire');
    
    // Gestion de la soumission du formulaire
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('[TP-INF336] Validation du formulaire...');
        
        // Récupération des valeurs
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const email = document.getElementById('email').value.trim();
        const prixHT = document.getElementById('prixHT').value.trim();
        
        // Validation des champs obligatoires
        if (!nom || !prenom || !telephone || !email || !prixHT) {
            alert('❌ Veuillez remplir tous les champs obligatoires (*)');
            return;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('❌ Format d\'email invalide');
            document.getElementById('email').focus();
            return;
        }
        
        // Validation téléphone (9 à 15 chiffres)
        const telRegex = /^[0-9]{9,15}$/;
        if (!telRegex.test(telephone.replace(/\s/g, ''))) {
            alert('❌ Le téléphone doit contenir entre 9 et 15 chiffres');
            document.getElementById('telephone').focus();
            return;
        }
        
        // Validation prix HT
        const prix = parseFloat(prixHT);
        if (isNaN(prix) || prix < 0) {
            alert('❌ Le prix HT doit être un nombre positif');
            document.getElementById('prixHT').focus();
            return;
        }
        
        // Calculer la TVA avant d'afficher le message
        const resultats = calculerTVA();
        
        // Récupération des informations supplémentaires
        const dateNaissance = document.getElementById('dateNaissance').value || 'Non renseigné';
        const sexe = document.getElementById('sexe').value || 'Non renseigné';
        const adresse = document.getElementById('adresse').value || 'Non renseigné';
        const codePostal = document.getElementById('codePostal').value || 'Non renseigné';
        const ville = document.getElementById('ville').value || 'Non renseigné';
        const pays = document.getElementById('pays').value || 'Non renseigné';
        const siteWeb = document.getElementById('siteWeb').value || 'Non renseigné';
        const devise = document.getElementById('deviseSelect').value;
        
        // Message de succès détaillé
        alert('✅ FORMULAIRE VALIDÉ AVEC SUCCÈS !\n\n' + 
              '═══════════════════════════════════\n' +
              '📋 INFORMATIONS PERSONNELLES\n' +
              '═══════════════════════════════════\n' +
              'Nom complet: ' + nom + ' ' + prenom + '\n' +
              'Date de naissance: ' + dateNaissance + '\n' +
              'Sexe: ' + sexe + '\n' +
              'Adresse: ' + adresse + '\n' +
              'Code postal: ' + codePostal + '\n' +
              'Ville: ' + ville + '\n' +
              'Pays: ' + pays + '\n' +
              'Téléphone: ' + telephone + '\n' +
              'Email: ' + email + '\n' +
              'Site web: ' + siteWeb + '\n\n' +
              '═══════════════════════════════════\n' +
              '💰 RÉSULTAT DU CALCUL\n' +
              '═══════════════════════════════════\n' +
              'Prix HT: ' + formaterMontant(resultats.prixHT, devise) + ' ' + resultats.symbole + '\n' +
              'TVA (17%): ' + formaterMontant(resultats.montantTVA, devise) + ' ' + resultats.symbole + '\n' +
              'Prix TTC: ' + formaterMontant(resultats.prixTTC, devise) + ' ' + resultats.symbole + '\n' +
              (resultats.reduction > 0 ? 'Réduction (' + resultats.reduction + '%): -' + formaterMontant(resultats.montantReduction, devise) + ' ' + resultats.symbole + '\n' : '') +
              '═══════════════════════════════════\n' +
              'TOTAL À PAYER: ' + formaterMontant(resultats.prixFinal, devise) + ' ' + resultats.symbole + '\n' +
              '═══════════════════════════════════\n\n' +
              '👨‍🏫 TP encadré par: Ing. KOTVA Samuel\n' +
              '📚 INF336 - Ingénierie des Applications Web');
    });
    
    // Formatage automatique du téléphone (chiffres uniquement)
    const telInput = document.getElementById('telephone');
    if (telInput) {
        telInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Calcul automatique lors de la saisie du prix
    const prixInput = document.getElementById('prixHT');
    if (prixInput) {
        prixInput.addEventListener('input', function() {
            if (this.value.trim() !== '' && parseFloat(this.value) >= 0) {
                calculerTVA();
            }
        });
    }
    
    // Calcul automatique lors du changement de devise
    const selectDevise = document.getElementById('deviseSelect');
    if (selectDevise) {
        selectDevise.addEventListener('change', function() {
            const prixHT = document.getElementById('prixHT').value.trim();
            if (prixHT !== '' && parseFloat(prixHT) >= 0) {
                calculerTVA();
            }
        });
    }
    
    // Calcul automatique lors de la saisie de la réduction
    const reductionInput = document.getElementById('reduction');
    if (reductionInput) {
        reductionInput.addEventListener('input', function() {
            const prixHT = document.getElementById('prixHT').value.trim();
            if (prixHT !== '' && parseFloat(prixHT) >= 0) {
                calculerTVA();
            }
        });
    }
    
    // Initialisation du color picker (valeur par défaut)
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker && !colorPicker.value) {
        colorPicker.value = '#0066cc';
    }
    
    // Affichage d'un message de bienvenue dans la console
    console.log('%c[TP-INF336] Fonctions disponibles:', 'color: #cc9900; font-weight: bold;');
    console.log('  ✅ calculerTVA() - Calcule la TVA 17% dans la devise choisie');
    console.log('  ✅ verifierPresence() - Recherche un nombre dans [10,25,42,50,88,100]');
    console.log('  ✅ afficherDateJour() - Affiche la date du jour au format FR');
    console.log('%c👨‍🎓 ADAM IDRISS KESSOU - L3 Informatique - Groupe 3', 'color: #3b82f6; font-weight: bold;');
});

// ============================================================
// GESTION DU BOUTON RÉINITIALISER
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const resetBtn = document.querySelector('button[type="reset"]');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Réinitialiser les résultats affichés
            setTimeout(() => {
                document.getElementById('montantTVA').innerHTML = 
                    '<i class="fas fa-calculator"></i> Montant TVA (17%): --';
                document.getElementById('prixTTC').innerHTML = 
                    '<i class="fas fa-tag"></i> Prix TTC: --';
                document.getElementById('ligneReduction').style.display = 'none';
                document.getElementById('prixFinal').innerHTML = 
                    '<i class="fas fa-check-circle"></i> Prix final: --';
                document.getElementById('resultatArray').innerHTML = 
                    '<i class="fas fa-database"></i> <span>En attente de recherche...</span>';
                document.getElementById('dateAujourdhui').innerHTML = 
                    '<i class="far fa-calendar-check"></i> <span>Cliquez pour afficher la date</span>';
                
                // Réinitialiser le range slider
                if (rangeSlider) {
                    rangeSlider.value = 50;
                    rangeOutput.textContent = '50%';
                    rangeSlider.style.background = `linear-gradient(90deg, #cc9900 50%, rgba(255,255,255,0.2) 50%)`;
                }
                
                console.log('[TP-INF336] Formulaire réinitialisé');
            }, 10);
        });
    }
});

// ============================================================
// EXPORT DES FONCTIONS POUR LA CONSOLE
// ============================================================
window.calculerTVA = calculerTVA;
window.verifierPresence = verifierPresence;
window.afficherDateJour = afficherDateJour;