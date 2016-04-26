function Invoice() {
    // Invoice d�finit les factures qui seront enregistr�es en DB
    // et modifiables au cours du mois, puis envoy�es � la compta
    // pour les ligues et clubs. Pour les utilisateurs particuliers
    // la facture sera envoy�e imm�diatement et pourra �tre g�n�r�e
    // depuis une 

    this.Id = 0;
    this.TotalHT = 0, 00;

    // Les factures doivent pouvoir se faire sur un mois
    this.Month = 12;
    this.Year = 2015;
    //Les diff�rentes Entry() s'�tant achev�s ce mois-ci
    this.Entries = [];

    // R�duction appliqu�e au total de la facture en pourcentage
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
        //Les diff�rentes Entry() s'�tant achev�s ce mois-ci
            Entries: data.Entries,

        // R�duction appliqu�e au total de la facture en pourcentage
            AppliedReduction: data.AppliedReduction
 
        // Il est possible d'impl�menter des fonctions ici
            
        }, data);
    }
 
    return Invoice;
})