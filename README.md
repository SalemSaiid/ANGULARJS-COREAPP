# ANGULARJS-COREAPP

<strong>app/i18n :</strong> contient les fichiers de traduction <br />
<strong>app/main :</strong> contient le module principal (Bootstrap) avec ces ressources <br />
<strong>app/wl.init.js :</strong> Initialisation du Worklight <br />
<strong>app/app.config.js :</strong> Fichier de configuration du module de démarrage (Bootstrap) <br />
<strong>app/global.config.js : </strong>Fichier de configuration globale de l'application <br />
<strong>app/global.modules.js : </strong>Fichier de déclaration des modules de l'app (Vendors et Custom modules) <br />
<strong>assets :</strong> contient les assets et les plugins externes <br />

![alt tag](http://s22.postimg.org/8hgtavgy9/structure.png) <br><br>

<strong>Création d'un moduleEdit</strong><br>
<strong>Déclaration du module</strong><br>

Il s'agit d'ajouter le module dans le fichier <strong>app/global.module.js</strong>sous l'objet CUSTOM_MODULE comme le montre l'exemple suivant : <br>

    {
        name: 'sample',
        autoLoad: true
    }

<br>
<strong>Création de l'arborescence</strong> <br>
Il suffit de créer sous app/modules un dossier avec le nom de votre nouveau module (exp "sample") puis créer les dossiers "controllers, views, services" selon votre besoin :<br>
![alt tag](http://s16.postimg.org/wkyt3gzbp/module.png) <br>
