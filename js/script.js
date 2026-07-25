document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year');
    const salaryInput = document.getElementById('salary');
    const statementPointsInput = document.getElementById('statement_points');
    const calcBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');

    // Populate year dropdown from config
    const years = Object.keys(RETRAITE_CONFIG.years).sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    calcBtn.addEventListener('click', () => {
        const year = yearSelect.value;
        const A15 = parseFloat(salaryInput.value); // Salaire
        const J15 = parseFloat(statementPointsInput.value); // Points sur relevé

        if (isNaN(A15) || isNaN(J15)) {
            alert('Veuillez saisir des valeurs numériques valides pour le salaire et les points du relevé.');
            return;
        }

        const config = RETRAITE_CONFIG.years[year];
        const rates = RETRAITE_CONFIG.rates;

        const C15 = config.PASS;
        const H15 = config.prix_point;
        
        // Calculs selon les formules d'Excel
        // E15 = (+C15*E13/100)/H15
        const E15 = (C15 * rates.T1_1 / 100) / H15;
        
        // F15 = (+C15*F13/100)/H15
        const F15 = (C15 * rates.T1_2 / 100) / H15;
        
        // G15 = ((+A15-C15)*G13/100)/H15 (note: text says H16, but formula in excel is H15)
        // Note: Si le salaire est inférieur au PASS, la différence A15-C15 sera négative. 
        // Selon l'excel (G15), cela produit un résultat négatif. Nous appliquons la formule stricte.
        const G15 = ((A15 - C15) * rates.T2 / 100) / H15;

        // Total points calculés (I15)
        const I15 = E15 + F15 + G15;

        // Différentiel (K15) = J15 - I15
        const diff = J15 - I15;

        // Affichage des résultats
        document.getElementById('res-year').textContent = year;
        document.getElementById('res-calculated').textContent = I15.toFixed(2);
        
        const diffSpan = document.getElementById('res-diff');
        diffSpan.textContent = diff.toFixed(2);
        
        // "Apparait alors la différence de point (J15-I15) en rouge si négatif en noir si positif."
        if (diff < 0) {
            diffSpan.className = 'value negative';
        } else {
            diffSpan.className = 'value positive';
        }

        resultsDiv.style.display = 'block';
    });
});
