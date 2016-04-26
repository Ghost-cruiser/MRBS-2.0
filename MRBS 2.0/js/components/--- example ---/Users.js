
function Category() {

// Category d�finit les ligues et clubs 
// Type : 0 = Ligue, 1 = Club;

    this.Id = 0;
    this.Name = "";
    this.Type = 0;

    // S'il s'agit d'un club associ� � une ligue,
    // ce param�tre est rempli par un Category();
    this.LeagueAffiliation = null;

    // Ensemble des informations de contact
    this.Siret = 0;
    this.TelNumber = "";
    this.Adress = "";
    this.MailAdress = "";
    this.City = "";
}


function User() {
// User d�finit les utilisateurs connect�s au site de r�servation
// Level : 0 = Super Admin, 1 = Administrateur, 2 = Utilisateurs.
// La logique : Un Super Admin a tous les droits, notamment l'ajout
// d'administrateurs;
//              Un Administrateur est un utilisateur d'une ligue (voire
// d'un club) qui a le droit de r�server pour sa ligue, ou des clubs de 
// sa ligue, et qui peut ajouter un nombre d'utilisateurs limit�s en 
// leur attribuant des droits [TODO : impl�menter la gestion de groupes
// d'utilisateurs partageant des droits] soit de r�servation, soit de 
//  consultation.

    this.Id = 0;
    this.Level = 2;

    // Ensemble des informations de contact
    this.TelNumber = "";
    this.Adress = "";
    this.MailAdress = "";
    this.City = "";

    this.username = "";
    this.password = "";

    this.FirstName = "";
    this.LastName = "";
}

function Rights() {
    //Inutile en code, uniquement en DB
    // this.Id = 0;

    // Droit de cr�ation d'utilisateur
    // 
    this.AllowCreateUser = false;
    this.AllowEntryForCategory = false;
    this.AllowEntryForUser = false;
    this.AllowCheckAllEntries = false;
    this.AllowCheckCategoryEntries = true;
    this.AllowModifyEntries = false;
}