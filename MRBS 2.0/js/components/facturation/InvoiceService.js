function Invoice() {
    // Invoice définit les factures qui seront enregistrées en DB
    // et modifiables au cours du mois, puis envoyées à la compta
    // pour les ligues et clubs. Pour les utilisateurs particuliers
    // la facture sera envoyée immédiatement et pourra être générée
    // depuis une 

    this.Id = 0;
    this.TotalHT = 0, 00;

    // Les factures doivent pouvoir se faire sur un mois
    this.Month = 12;
    this.Year = 2015;
    //Les différentes Entry() s'étant achevés ce mois-ci
    this.Entries = [];

    // Réduction appliquée au total de la facture en pourcentage
    this.AppliedReduction = 0;
}

angular.module('MRBS').factory('Invoice', function() {
 
    var Invoice = function (data) {
        angular.extend(this, {    
            Id: data.Id,
            TotalHT: data.TotalHT,

        // Les factures doivent pouvoir se faire sur un mois
            Month: data.Month,
            Year: data.Year,
        //Les différentes Entry() s'étant achevés ce mois-ci
            Entries: data.Entries,

        // Réduction appliquée au total de la facture en pourcentage
            AppliedReduction: data.AppliedReduction
 
        // Il est possible d'implémenter des fonctions ici
            
        }, data);
    }
 
    return Invoice;
})