# WORKFLOW GIT
==================

ce document référence la bonne manière de travailler sur la branch __*master*__

/!\ ne plus travailler/puller/pusher  sur __*front*__ ni __*dev*__ (les branches sont dépréciées) /!\

voici le workflow pour faire un branch feature à partir de __*master*__

De manière général stopper le grunt watch avant de faire un rebase

1. Création d'un nouvelle branch __*front-feat_name*__
    1. <code>git fetch</code> (1)
    2. <code>git rebase -p origin/master</code>
        * résoudre les conflits si besoin (cf 5.)
    3. <code>git checkout -b front-feat_name</code> (2)
2. Commit de la branch __*front-feat_name*__
    1. <code>git commit -m"[NOM DU MODULE] description du commit (front-feat_name)"</code>
    2. <code>git fetch</code>
        * si pas de nouvelle version de __*master*__ -> on continue
        * si nouvelle verion de __*master*__ -> <code>git rebase -p origin/master</code>
            * résoudre les conflits si besoin (cf 5.)
3. merge de la branch __*front-feat_name*__ dans __*master*__ ( une fois tous les commit et les rebase OK sur __*front-feat_name*__)
    1. <code>git checkout master</code>
    2. <code>git fetch</code>
        * si pas de nouvelle version de __*master*__ -> on continue
        * si nouvelle verion de __*master*__ -> <code>git rebase -p origin/master</code>
            * résoudre les conflits si besoin (cf 5.)
    3. <code>git merge --no-ff front-feat_name</code>
        * résoudre les conflits si besoin
    4. <code>git push origin master</code>
4. une fois mergée
    1. soit vous en avez fini avec cette feature
        1. vous supprimez la branche en local <code>git branch -d front-feat_name</code>
        1. vous supprimez la branche sur le repo si vous l'avez crée <code>git push origin :front-feat_name</code>
    2. soit vous continuez à travailler sur la branch __*front-feat_name*__ et vous recommencer le process à partir de l'étape 2.
5. Conflit dans un rebase
    1. resoudre les conflits comme un commit classique
    2. ne pas oublier d'ajouter les fichiers <code>git add .</code>
    3. <code>git rebase --continue</code> (à la place de *git commit*)
    4. Valider le message de rebase continue généré automatiquement (<code>Esc : w q</code> comme pour un commit de merge classique)
    5. répéter l'operation si plusieurs commit sont rejoués
6. Plantage du site après un rebase de master (bunble/class manquant)
    1. <code>composer install</code> suffit à résoudre le problème
    2. si non, vérifier que vous n'avez pas oublié d'activer les modules pdo_pgsql dans votre wamp / uwamp. (cf Readme.md)
    3. si toujours pas -> voir avec le leadDev




(1) idem que <code>git fetch origin</code>

(2) (revient à faire <code>git branch front-feat_name</code> puis <code>git checkout front-feat_name</code>)


