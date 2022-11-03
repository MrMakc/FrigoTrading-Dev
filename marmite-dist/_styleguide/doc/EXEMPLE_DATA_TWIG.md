# EXEMPLE DATA
==================



Placer vos fichiers de données dans le dossier `app/Resources/C2isOneTeaBundle/assets/fixtures`

Pour plus de clartée, créer un fichier par tableau de données => `app/Resources/C2isOneTeaBundle/assets/fixtures/dataTest.yml`

Exemple de structure de données =>

    test1:
      firstName: "Toto l'artiste"
      lastName: "Tata"
      children:
        child1:
          firstName: "Tootoo"
          lastName: "Taataa"
        child2:
          firstName: "Toatoa"
          lastName: "Taotao"

    test2:
      firstName: "Titi"
      lastName: "Tutu"
      children:
        child1:
          firstName: "Tiotio"
          lastName: "Tautau"
    test3:
      firstName: "Tété"
      lastName: "Tonton"

ou =>

    - "Toto"
    - "Tata"
    - "Titi"
    - "Tutu"
    - "Tonton"


Puis appelez vos données de la manière suivante dans vos twig

    {% set dataTest = getFixtures('app/Resources/C2isOneTeaBundle/assets/fixtures/dataTest.yml') %}
    {% for key, test in dataTest %}
        {{ dump(key) }}
        {{ dump(test) }}
        ...<br>
        {{ test.firstName }} {{ test.lastName }}<br>
        ...
    {% endfor %}

Vous pouvez aussi l'appeler directement dans vos crontroler php (mais c'est pas très propre, cf NPH)

    $dataTest = getFixtures('app/Resources/C2isOneTeaBundle/assets/fixtures/dataTest.yml')

