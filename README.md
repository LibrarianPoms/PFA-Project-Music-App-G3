Voila le projet et le rapport!      
Groupe: G3IIR             
Groupe PFA: Aymane Bouras, Youssef Amargui, Imhah Saad           
La commande pour démarrer le serveur de lApp WAVVE est .\start_server.bat             
Le rapport est fait avec Latex:                             
\documentclass[12pt,a4paper]{report}
\usepackage[utf8]{inputenc}
\usepackage[french]{babel}
\usepackage{geometry}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{tocloft}
\usepackage{hyperref}
\usepackage{array}
\usepackage{tabularx}
\usepackage{longtable}
\usepackage{multirow}
\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{amssymb}

\geometry{left=2.5cm,right=2.5cm,top=2.5cm,bottom=2.5cm}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[R]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

\titleformat{\chapter}[display]
{\normalfont\huge\bfseries}{\chaptertitlename\ \thechapter}{20pt}{\Huge}

\renewcommand{\contentsname}{Table des matières}
\renewcommand{\listfigurename}{Liste des figures}
\renewcommand{\listtablename}{Liste des tableaux}

\begin{document}

\begin{titlepage}
\centering
\vspace*{1cm}

\includegraphics[width=0.4\textwidth]{img/logo.png}

\vspace{1cm}

{\LARGE\bfseries PROJET DE FIN D'ANNÉE}

\vspace{0.5cm}

{\large\textit{« 3ème Année en Ingénierie Informatique et Réseaux »}}

\vspace{1cm}

\vspace{2cm}

{\Large\bfseries Réalisé par :}

\vspace{0.5cm}

{\large\textit{Amargui Youssef, Bouras Aymane et Imhah Saad}}

\vspace{1cm}

{\Large\bfseries Tuteur(s) :}

\vspace{0.5cm}

{\large\textit{Encadrant Pédagogique : Amina Ouatiq}}

\vfill

{\large\bfseries Année universitaire : 2024/2025}

\end{titlepage}

\chapter*{Dédicaces}
\addcontentsline{toc}{chapter}{Dédicaces}

À l'issue de ce projet, nos pensées se tournent avec reconnaissance vers toutes les personnes qui ont contribué, de près ou de loin, à sa réalisation. À nos familles, pour leur soutien indéfectible, leur amour constant et les sacrifices souvent silencieux qu'elles ont consentis. À nos amis, dont la présence, l'écoute et les moments partagés nous ont apporté force et réconfort. À nos enseignants, pour la transmission de leur savoir, leur exigence empreinte de bienveillance et l'inspiration qu'ils nous ont donnée. À tous ceux qui ont croisé notre chemin, pour chaque mot, chaque geste, chaque aide, qu'elle ait été modeste ou précieuse. Ce projet est aussi le vôtre. Nous vous adressons notre profonde gratitude : merci.

\chapter*{Remerciements}
\addcontentsline{toc}{chapter}{Remerciements}

Au terme de ce projet de fin d'études, nous souhaitons adresser nos plus vifs remerciements à celles et ceux qui ont rendu cette aventure possible.

Notre reconnaissance s'adresse tout particulièrement à \textbf{Madame Amina Ouatiq}, dont l'expertise et la bienveillance ont guidé chacun de nos pas. Son accompagnement rigoureux, sa patience inépuisable et ses précieux conseils ont été des atouts inestimables dans l'accomplissement de ce travail. Sa capacité à nous orienter tout en nous laissant développer notre autonomie a transformé ce projet en une expérience profondément formatrice.

Nous exprimons également notre gratitude envers \textbf{l'ensemble du corps professoral} qui a jalonné notre parcours académique. La richesse de leurs enseignements, leur passion communicative et leur exigence bienveillante ont forgé non seulement nos compétences techniques, mais aussi notre éthique professionnelle. Leurs observations pertinentes et leurs critiques constructives ont considérablement enrichi la qualité de notre réflexion et de notre production.

Que soient également remerciées \textbf{toutes les personnes} qui, dans l'ombre ou la lumière, ont apporté leur pierre à l'édifice de ce projet. Chaque contribution, aussi modeste soit-elle, a participé à l'aboutissement de ce travail dont nous sommes aujourd'hui fiers.

À tous, nous adressons l'expression de notre profonde gratitude.
\end{titlepage}

\tableofcontents
\newpage

\listoffigures

\listoftables

\chapter*{Introduction générale}
\addcontentsline{toc}{chapter}{Introduction générale}
\label{intro_generale}

Dans un paysage numérique où la consommation musicale est devenue omniprésente, l'accès à un catalogue musical diversifié et personnalisé représente un enjeu majeur pour les mélomanes. Face à cette demande croissante, notre équipe a conçu \textbf{Wavve}, une application de streaming musical intuitive et performante.

Wavve se positionne comme une alternative innovante dans le domaine du streaming audio, en proposant une expérience utilisateur fluide et des fonctionnalités comparables à celles des leaders du marché tels que Spotify. Notre plateforme permet aux utilisateurs de découvrir, écouter et partager leur musique préférée, tout en bénéficiant de recommandations personnalisées basées sur leurs habitudes d'écoute.

L'application a été développée en utilisant un stack technologique robuste et moderne. Le backend repose sur \textbf{Python}, choisi pour sa polyvalence et sa riche bibliothèque d'outils de traitement audio et d'analyse de données. La persistance des données est assurée par une base de données \textbf{MySQL}, offrant performance et fiabilité pour la gestion d'un large catalogue musical et des profils utilisateurs. L'interface utilisateur, élégante et responsive, a été conçue avec \textbf{HTML5}, \textbf{CSS3} et \textbf{JavaScript}, garantissant une expérience cohérente sur tous les appareils.

Parmi les fonctionnalités clés de Wavve, on retrouve :

\begin{itemize}
    \item La création de comptes utilisateurs personnalisés
    \item L'exploration d'un vaste catalogue musical catégorisé par genres, artistes et albums
    \item La création et le partage de playlists personnalisées
    \item Un système de recommandation basé sur les préférences utilisateur
    \item Un lecteur audio intuitif avec contrôle de volume, lecture aléatoire et répétition
    \item Une interface de recherche avancée
    \item Des fonctionnalités sociales permettant de suivre d'autres utilisateurs et découvrir leurs playlists
\end{itemize}

Ce projet s'inscrit dans notre volonté d'exploiter les technologies modernes de développement web et de gestion de données pour créer une solution de streaming musical accessible et performante. L'architecture client-serveur que nous avons adoptée permet une évolutivité optimale, garantissant la possibilité d'enrichir l'application avec de nouvelles fonctionnalités au fil du temps.

Wavve représente non seulement une réponse technique aux défis du streaming musical contemporain, mais également une vision où la technologie se met au service de l'expérience musicale, rendant la musique plus accessible, plus personnelle et plus sociale.

% Chapitre 1
\chapter{Présentation du cadre de projet}
\label{chap1}

\section{Introduction}

Le streaming musical actuel, malgré sa popularité, présente encore des limites en termes d'expérience utilisateur, avec des interfaces complexes et des recommandations souvent inadaptées aux préférences individuelles des auditeurs.

Wavve répond à ce défi en proposant une plateforme de streaming musicale intuitive, développée avec Python, MySQL et des technologies web modernes (HTML, CSS, JavaScript). Notre application offre une alternative aux services existants en mettant l'accent sur la personnalisation et la facilité d'utilisation.

Notre objectif est simple : permettre aux utilisateurs de découvrir, organiser et partager leur musique de manière plus fluide et personnalisée, transformant ainsi leur expérience d'écoute quotidienne.

\section{Contexte et état de l'art}

\subsection{Présentation des plateformes existantes}

Le marché du streaming musical est dominé par plusieurs acteurs majeurs comme Spotify, Apple Music, Deezer et YouTube Music. Ces plateformes offrent des catalogues musicaux vastes et des fonctionnalités avancées.

\subsection{Limites des solutions actuelles}

Aujourd'hui, malgré la popularité des plateformes de streaming musical, il reste difficile pour certains utilisateurs d'accéder à une expérience personnalisée et fluide sans passer par des services payants ou complexes. De plus, de nombreuses applications manquent de simplicité, d'ergonomie ou de fonctionnalités communautaires telles que le partage ou la recommandation musicale.

\subsection{Problématique}

La problématique centrale de notre projet réside dans la nécessité de créer une alternative accessible et personnalisée aux plateformes de streaming existantes, en mettant l'accent sur l'expérience utilisateur et la simplicité d'utilisation.

\section{Solution proposée}

Pour répondre à cette problématique, nous avons développé \textbf{Wavve}, une application web de streaming musical inspirée de Spotify. Elle permet aux utilisateurs d'écouter de la musique, de créer des playlists, de rechercher des artistes ou des albums, et de suivre d'autres utilisateurs. L'interface est simple, moderne et accessible, et l'application intègre un système de recommandations automatiques pour enrichir l'expérience musicale.

\section{Choix de modèle de développement}

Pour développer notre application, nous avons opté pour le \textbf{modèle en V}. Ce modèle offre une structure claire avec des phases de conception suivies immédiatement par des phases de tests, ce qui garantit une validation continue. Il convient parfaitement à notre projet car les besoins ont été bien définis dès le début et ont peu évolué. Ce choix nous a permis de limiter les erreurs, de mieux organiser notre travail, et de livrer une application stable et fonctionnelle, en accord avec les principes du cours de Génie Logiciel.

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/cycle_v.png}
\caption{Le cycle en V appliqué au développement de Wavve}
\label{fig:cycle_v}
\end{figure}

\section{Planning prévisionnel}

\begin{table}[h]
\centering
\caption{Planning prévisionnel de développement de l'application}
\label{tab:planning}
\begin{tabular}{|l|c|c|c|c|c|c|c|c|c|c|c|c|}
\hline
\multirow{2}{*}{\textbf{Étape}} & \multicolumn{4}{c|}{\textbf{Mars}} & \multicolumn{4}{c|}{\textbf{Avril}} & \multicolumn{4}{c|}{\textbf{Mai}} \\
\cline{2-13}
& \textbf{1} & \textbf{2} & \textbf{3} & \textbf{4} & \textbf{1} & \textbf{2} & \textbf{3} & \textbf{4} & \textbf{1} & \textbf{2} & \textbf{3} & \textbf{4} \\
\hline
\textit{Étude préalable} & & & x & x & & & & & & & & \\
\hline
\textit{Conception} & & & & & x & x & & & & & & \\
\hline
\textit{Réalisation} & & & & & & & x & x & x & & & \\
\hline
\textit{Test et Validation} & & & & & & & & & & x & x & x \\
\hline
\end{tabular}
\end{table}

\section{Conclusion}

Ce projet nous a permis de développer une application web de musique nommée \textbf{Wavve}. Nous avons pu mettre en œuvre nos compétences en développement web, base de données et conception d'interfaces. Ce travail a été une expérience enrichissante qui nous a permis de consolider nos acquis et de découvrir de nouveaux aspects du développement d'applications.

\chapter{Spécification des besoins}
\label{chap2}

\section{Introduction}

Dans ce chapitre, nous allons détailler les besoins auxquels doit répondre l'application Wavve. Ces besoins sont divisés en deux catégories : les besoins fonctionnels, qui décrivent ce que l'application doit faire, et les besoins non fonctionnels, qui définissent les contraintes techniques, de performance et d'ergonomie. Ce chapitre comprend également les cas d'utilisation permettant de visualiser l'interaction entre les utilisateurs et le système.

\section{Spécification des besoins fonctionnels}

\subsection{Gestion des utilisateurs}

\begin{itemize}
    \item Inscription et authentification des utilisateurs via un formulaire sécurisé.
    \item Création de profils utilisateurs contenant les informations de base (nom, e-mail, photo, préférences musicales).
    \item Suivi d'autres utilisateurs (fonction de « follow »).
    \item Historique d'écoute consultable par l'utilisateur.
\end{itemize}

\subsection{Gestion de la musique (artistes, albums, titres)}

\begin{itemize}
    \item Consultation des artistes et de leurs albums.
    \item Affichage des titres disponibles dans chaque album.
    \item Possibilité de lire un morceau via un lecteur intégré.
    \item Récupération des données musicales à partir de l'API Deezer.
\end{itemize}

\subsection{Création et gestion des playlists}

\begin{itemize}
    \item Création de playlists personnelles par l'utilisateur.
    \item Ajout et suppression de morceaux dans une playlist.
    \item Partage de playlists avec d'autres utilisateurs.
    \item Affichage des playlists populaires ou recommandées.
\end{itemize}

\subsection{Système de recherche et recommandations}

\begin{itemize}
    \item Barre de recherche permettant de retrouver des morceaux, artistes ou albums.
    \item Suggestions dynamiques basées sur l'historique d'écoute.
    \item Recommandations personnalisées de playlists.
\end{itemize}

\section{Spécification des besoins non fonctionnels}

Les besoins non fonctionnels définissent les exigences de qualité que doit respecter l'application Wavve. Ils ne concernent pas directement les fonctionnalités offertes, mais influencent fortement l'expérience utilisateur, la maintenabilité du système, et sa robustesse. Voici les principaux besoins identifiés :

\subsection{Interface utilisateur responsive et moderne}

L'interface de Wavve a été conçue pour s'adapter automatiquement aux différentes tailles d'écran (ordinateurs, tablettes, smartphones), grâce à l'utilisation de HTML5, CSS3 et de techniques de responsive design. Cela garantit une navigation fluide, que ce soit sur un grand écran ou un appareil mobile. L'ergonomie a été soigneusement travaillée pour offrir une expérience intuitive et agréable.

\subsection{Compatibilité multiplateforme et navigateurs}

L'application doit être pleinement fonctionnelle sur les principaux navigateurs modernes tels que Google Chrome, Mozilla Firefox, Microsoft Edge et Safari. Le code a été testé pour garantir l'uniformité de l'affichage et du comportement des interfaces, quelle que soit la plateforme utilisée (Windows, macOS, Linux).

\subsection{Performances et optimisation du temps de chargement}

L'optimisation des performances est un critère fondamental pour garantir la fluidité de l'écoute et la réactivité de l'interface. Le code JavaScript est structuré de manière asynchrone pour éviter les blocages, et les requêtes SQL sont optimisées pour réduire le temps de réponse. Les fichiers CSS et JS sont minifiés, et les ressources médias sont chargées de manière progressive.

\subsection{Sécurité des données utilisateurs}

La sécurité des utilisateurs est une priorité. Les mots de passe sont hachés (et non stockés en clair) à l'aide d'un algorithme sécurisé (comme bcrypt). Les sessions utilisateurs sont protégées contre les attaques CSRF et XSS. Les pages sensibles sont accessibles uniquement après authentification. L'application respecte également les bonnes pratiques en matière de gestion des données personnelles.

\subsection{Architecture modulaire et maintenabilité}

Le code côté serveur est structuré de façon modulaire, avec une séparation claire entre les modèles, les vues, les routes et les contrôleurs (selon le principe MVC). Cette organisation facilite la lecture, les tests et les évolutions futures. Le choix d'une base de données relationnelle (MySQL) assure une structuration robuste des données et facilite leur manipulation via des requêtes SQL efficaces.

\subsection{Extensibilité et évolutivité}

Wavve a été pensée pour être évolutive : de nouvelles fonctionnalités (comme la diffusion en direct, l'ajout de commentaires ou l'intégration d'autres APIs musicales) pourront être ajoutées sans nécessiter une refonte complète du système. Le découpage logique du backend et du frontend permet une évolution séparée de chaque couche.

\section{Cas d'utilisation}

\subsection{Acteurs du système}

L'application de musique Wavve est conçue pour un seul type d'acteur principal : l'utilisateur (ou client). Cet acteur représente toute personne utilisant la plateforme pour accéder à du contenu musical en ligne.

\textbf{Client :} L'utilisateur est au centre de l'expérience proposée par Wavve. Il peut créer un compte, se connecter à la plateforme et accéder à son espace personnel. Il a la possibilité de rechercher de la musique, de consulter les artistes, albums et titres disponibles, ainsi que de créer et gérer ses propres playlists. L'interface lui permet également d'écouter des morceaux en streaming et de bénéficier de suggestions musicales basées sur ses préférences ou son historique d'écoute.

Les cas d'utilisation présentés dans cette section décrivent les différentes actions que l'utilisateur peut effectuer au sein de l'application. Ils permettent d'avoir une vision globale et structurée des principales fonctionnalités offertes par Wavve.

\subsection{Description des cas d'utilisation}

Dans cette section, nous allons décrire les cas d'utilisation de l'application Wavve, centrés sur l'unique acteur du système : l'utilisateur (client). Chaque cas représente une interaction typique entre l'utilisateur et l'application. Voici un exemple structuré :

\begin{table}[h]
\centering
\caption{Description du cas d'utilisation « Création de playlist »}
\label{tab:cas_utilisation}
\begin{tabular}{|p{3cm}|p{10cm}|}
\hline
\textbf{Cas n°} & 1 \\
\hline
\textbf{Acteur(s)} & Utilisateur (Client) \\
\hline
\textbf{Objectif} & Permettre à l'utilisateur de créer une nouvelle playlist musicale personnelle. \\
\hline
\textbf{Pré-condition(s)} & L'utilisateur doit être connecté à son compte sur l'application Wavve. \\
\hline
\textbf{Post-condition(s)} & Une nouvelle playlist est créée et associée au profil de l'utilisateur. \\
\hline
\textbf{Scénario nominal} & 
\begin{enumerate}
    \item L'utilisateur se connecte à l'application.
    \item Il accède à la section « Mes Playlists ».
    \item Il clique sur « Créer une playlist ».
    \item Il saisit le nom de la playlist.
    \item Il valide la création.
    \item La playlist est enregistrée dans la base de données et visible dans l'espace personnel de l'utilisateur.
\end{enumerate} \\
\hline
\textbf{Scénario alternatif} & Si l'utilisateur tente de créer une playlist sans nom, l'application affiche un message d'erreur l'invitant à saisir un nom valide. \\
\hline
\end{tabular}
\end{table}

\subsection{Diagramme de cas d'utilisation global}

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/cas.jpeg}
\caption{Diagramme de cas d'utilisation global de l'application Wavve}
\label{fig:diagramme_cas_utilisation}
\end{figure}

% Chapitre 3
\chapter{Conception du système}
\label{chap3}

\section{Introduction}

Dans ce chapitre, nous allons modéliser notre application de streaming musical selon deux aspects fondamentaux : statique et dynamique.

\begin{enumerate}
    \item La \textbf{modélisation statique} décrit la structure du système (classes, déploiement, relations).
    \item La \textbf{modélisation dynamique} représente les interactions et les comportements du système au fil du temps (séquences, collaboration, états).
\end{enumerate}

\section{Modélisation dynamique}

\subsection{Diagrammes de séquences}

Un diagramme de séquence est un diagramme d'interaction dont le but est de décrire comment les objets collaborent au cours du temps et quelles responsabilités ils assument. Il décrit un scénario d'un cas d'utilisation.

Avec les intéressants ajouts au diagramme de séquences apportés par UML 2, en particulier les cadres d'interactions (avec les opérateurs \textit{loop}, \textit{opt} et \textit{alt} par exemple), ainsi que la possibilité de référencer une interaction décrite par ailleurs, le diagramme de séquence système nous semble constituer une excellente solution.

Les différents messages représentés par un diagramme de séquence sont :

\begin{itemize}
    \item \textbf{Message asynchrone :} Il n'attend pas de réponse et ne bloque pas l'émetteur qui ne sait pas si le message arrivera à destination.
    \item \textbf{Message synchrone :} L'émetteur reste alors bloqué le temps que dure l'invocation de l'opération.
    \item \textbf{Messages de création et destruction d'instance :} La création d'un objet est matérialisée par une flèche qui pointe sur le sommet d'une ligne de vie et la destruction d'un objet est matérialisée par une croix qui marque la fin de la ligne de vie de l'objet.
\end{itemize}

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/sequence_login.jpeg}
\caption{Diagramme de séquences "Login"}
\label{fig:sequence_login}
\end{figure}

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/creation_playlist.jpeg}
\caption{Diagramme de séquences "Lancement de musique"}
\label{fig:sequence_musique}
\end{figure}

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/sequence_playlist.jpeg}
\caption{Diagramme de séquences "Création de Playlist"}
\label{fig:sequence_playlist}
\end{figure}

\subsection{Diagrammes de collaboration}

Les diagrammes de collaboration montrent les interactions entre objets dans un contexte particulier. Ils mettent l'accent sur l'organisation structurelle des objets qui envoient et reçoivent des messages.

\subsection{Diagrammes d'états}

Les diagrammes d'états décrivent les différents états d'un objet au cours de sa vie et les transitions entre ces états en réponse à des événements.

\subsection{Diagrammes d'état-transition}

Ces diagrammes permettent de modéliser le comportement dynamique d'une classe en montrant les états possibles des instances de cette classe et les transitions entre ces états.

\subsection{Diagrammes d'activité}

Les diagrammes d'activité représentent les flux de contrôle et de données dans un système. Ils permettent de modéliser les processus métier et les algorithmes.

\section{Modélisation statique}

\subsection{Diagramme de classes}

Le diagramme de classes présente la structure statique du système en montrant les classes, leurs attributs, leurs méthodes et les relations entre elles.

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/classe.jpeg}
\caption{Diagramme de classes de l'application Wavve}
\label{fig:diagramme_classes}
\end{figure}

\subsection{Modèle relationnel de la base de données}

Le modèle relationnel découle du diagramme de classes en appliquant les règles de passage du modèle objet vers le modèle relationnel.

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/relationnel.jpeg}
\caption{Modèle relationnel de la base de données}
\label{fig:modele_relationnel}
\end{figure}

\subsection{Architecture de l'application}

\subsubsection{Architecture logicielle}

Cette section présente le diagramme de composants de l'application Wavve. Ce diagramme illustre les différentes parties logicielles qui composent l'application (frontend, backend, base de données, API Deezer, etc.), ainsi que leurs interactions. Il permet de visualiser l'organisation modulaire du code, facilitant la maintenance, l'évolutivité et la réutilisabilité des composants.

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/archlog.jpeg}
\caption{Architecture logicielle de l'application Wavve}
\label{fig:architecture_logicielle}
\end{figure}

\subsubsection{Architecture matérielle}

Dans cette partie, nous présentons le diagramme de déploiement, qui décrit la structure matérielle sur laquelle l'application est exécutée. Ce diagramme met en évidence les nœuds matériels (serveur web, base de données, client) ainsi que les connexions réseau entre eux. Il reflète la configuration réelle ou prévue de l'environnement de production ou de test.

\textbf{Remarques importantes :}
\begin{itemize}
    \item Les nœuds (serveur, client, base de données) sont représentés de manière explicite.
    \item Les liens de communication (HTTP, SQL, API) doivent être indiqués entre les nœuds pour représenter le flux d'échange.
\end{itemize}

\section{Conclusion}

Ce chapitre a permis de présenter la conception technique du système, à travers des diagrammes dynamiques (séquences, états), statiques (classes, base de données), ainsi que les architectures logicielle et matérielle. Ces éléments offrent une vue d'ensemble claire et structurée de la manière dont l'application Wavve a été pensée et organisée avant sa mise en œuvre.

% Chapitre 4
\chapter{Réalisation du système}
\label{chap4}

\section{Introduction}

Dans ce chapitre, nous présentons la phase de développement de l'application Wavve. Après avoir défini les besoins et conçu l'architecture du système, nous sommes passés à la mise en œuvre technique. Cette étape comprend le choix des outils, l'installation de l'environnement de développement, le codage des fonctionnalités principales et la création des interfaces graphiques.

\section{Environnement de développement}

\subsection{Environnement matériel}

Le développement de l'application a été réalisé sur un environnement matériel standard, composé de :

\begin{itemize}
    \item \textbf{Processeur} : Intel Core i7
    \item \textbf{Mémoire RAM} : 16 Go
    \item \textbf{Disque} : SSD 256 Go
    \item \textbf{Système d'exploitation} : Windows 11
\end{itemize}

Ces caractéristiques ont été suffisantes pour assurer le bon fonctionnement des outils de développement et d'exécution nécessaires au projet.

\subsection{Environnement logiciel}

Pour mener à bien ce projet, nous avons utilisé un ensemble d'outils modernes adaptés au développement web full stack :

\textbf{Frontend :}
\begin{itemize}
    \item \textbf{Langage} : JavaScript (React JS), HTML
    \item \textbf{Framework CSS} : Tailwind CSS
\end{itemize}

\textbf{Backend :}
\begin{itemize}
    \item \textbf{Langage} : Python
    \item \textbf{Framework} : Django
\end{itemize}

\textbf{Base de données :}
\begin{itemize}
    \item \textbf{SGBD} : SQLite
\end{itemize}

\textbf{Outils de développement :}
\begin{itemize}
    \item \textbf{IDE} : Visual Studio Code
    \item \textbf{Outil de modélisation} : StarUML
\end{itemize}

Ces outils ont été choisis pour leur compatibilité, leur large communauté, et leur capacité à produire un site web interactif, performant et responsive.

\section{Principales interfaces graphiques}

L'application Wavve dispose d'une interface utilisateur moderne, intuitive et responsive, pensée pour offrir une expérience fluide sur tout type de support (ordinateur, tablette, smartphone). Voici les principales interfaces graphiques développées :

\subsection{Page d'accueil}

Cette interface constitue la porte d'entrée de l'application Wavve. Elle présente brièvement le concept de la plateforme et met en avant les fonctionnalités phares telles que l'écoute de musique en streaming, la création de playlists et les recommandations personnalisées. Elle propose également un accès rapide à l'inscription et à la connexion.

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/archlog.jpeg}
\caption{Interface utilisateur - Page d'accueil}
\label{fig:interface_accueil}
\end{figure}

\subsection{Page de création de compte}

Elle permet à un nouvel utilisateur de s'inscrire sur la plateforme en remplissant un formulaire contenant les informations suivantes : nom, adresse email, mot de passe. Une vérification des champs est mise en place pour assurer la validité des données saisies (mot de passe sécurisé, email au bon format, etc.).

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/insc.jpeg}
\caption{Interface de création de compte}
\label{fig:interface_inscription}
\end{figure}

\subsection{Page de connexion}

L'utilisateur enregistré peut accéder à son espace personnel en saisissant son email et mot de passe. En cas d'échec, des messages d'erreur clairs sont affichés.

\begin{figure}[h]
\centering
\includegraphics[width=0.9\textwidth]{img/login.jpeg}
\caption{Interface de connexion}
\label{fig:interface_connexion}
\end{figure}

\subsection{Formulaire de création de playlist}

Cette interface permet à l'utilisateur de créer une nouvelle playlist musicale. Il lui suffit de renseigner un nom pour la playlist, puis d'y ajouter des morceaux via une recherche intégrée. L'interface permet également de modifier ou supprimer des playlists existantes.

\begin{figure}[h]
\centering
\includegraphics[width=0.6\textwidth]{img/int_playlist.jpeg}
\caption{Interface de création d'une playlist}
\label{fig:interface_playlist}
\end{figure}

\subsection{Interface de lecture musicale}

Le lecteur audio intégré offre toutes les fonctionnalités essentielles : lecture/pause, contrôle du volume, avance/retour, lecture aléatoire et répétition. L'interface affiche également les informations du morceau en cours (titre, artiste, album, pochette).

\subsection{Interface de recherche}

La barre de recherche permet aux utilisateurs de trouver rapidement des artistes, albums ou morceaux. Les résultats sont affichés de manière organisée avec des suggestions de recherche automatiques.

\section{Conclusion}

La phase de réalisation nous a permis de transformer la conception théorique de Wavve en une application web fonctionnelle. Grâce à une bonne planification et à l'utilisation d'outils appropriés, nous avons pu développer une plateforme complète qui répond aux besoins identifiés. L'architecture modulaire du projet permet une bonne maintenabilité et une facilité d'évolution pour des fonctionnalités futures.

% Conclusion générale
\chapter*{Conclusion générale}
\addcontentsline{toc}{chapter}{Conclusion générale}

Le développement de l'application de streaming musical Wavve nous a permis de mettre en pratique l'ensemble des compétences acquises tout au long de notre formation. Inspirée des grandes plateformes comme Spotify, Wavve intègre les fonctionnalités essentielles d'une application musicale moderne : navigation par artistes et albums, création de playlists, recherche intelligente, recommandations personnalisées et une interface utilisateur responsive.

Nous avons pu travailler sur toutes les étapes de conception d'une application web : analyse des besoins, modélisation, choix technologiques, développement et tests. Ce projet nous a permis de renforcer nos connaissances en Python, MySQL, HTML/CSS/JS et d'adopter une démarche de développement structurée basée sur le modèle en V.

L'application développée répond aux objectifs fixés initialement :
\begin{itemize}
    \item Offrir une interface utilisateur intuitive et moderne
    \item Permettre la gestion complète des playlists personnalisées
    \item Intégrer un système de recommandations musicales
    \item Assurer une expérience d'écoute fluide et responsive
    \item Maintenir un haut niveau de sécurité pour les données utilisateurs
\end{itemize}

Les défis techniques rencontrés nous ont permis d'approfondir nos compétences en développement web full-stack, notamment dans l'intégration d'APIs externes, la gestion de bases de données relationnelles et l'optimisation des performances front-end.

En termes de perspectives d'évolution, plusieurs améliorations pourraient être apportées à Wavve :
\begin{itemize}
    \item Ajout d'un mode hors ligne pour l'écoute sans connexion
    \item Intégration de fonctionnalités sociales plus avancées
    \item Développement d'une application mobile native
    \item Amélioration des algorithmes de recommandation avec l'intelligence artificielle
    \item Intégration de nouvelles sources musicales via d'autres APIs
\end{itemize}

En résumé, ce projet a été une expérience enrichissante, aussi bien sur le plan technique que personnel. Il nous a permis de mieux comprendre les enjeux de la création d'une plateforme web interactive et scalable, et nous ouvre des perspectives intéressantes pour des évolutions futures dans le domaine du développement d'applications web.

% Bibliographie
\chapter*{Bibliographie et Nétographie}
\addcontentsline{toc}{chapter}{Bibliographie et Nétographie}
\label{bibliographie}

\section*{Bibliographie}

\begin{enumerate}
    \item BUREL, Guy. \textit{Développement d'applications web avec Django}. Éditions ENI, 2022.
    \item LEMAY, Laura. \textit{Apprenez à programmer avec Python}. Eyrolles, 2021.
    \item ROQUES, Pascal. \textit{UML 2 par la pratique}. Eyrolles, 5e édition, 2010.
    \item MEYER, Bertrand. \textit{Ingénierie logicielle}. Dunod, 2019.
\end{enumerate}

\section*{Nétographie}

\begin{itemize}
    \item \url{https://developer.deezer.com/} -- Documentation officielle de l'API Deezer
    \item \url{https://flask.palletsprojects.com/} -- Documentation du framework Flask
    \item \url{https://getbootstrap.com/} -- Documentation Bootstrap
    \item \url{https://www.w3schools.com/} -- Références HTML/CSS/JavaScript
    \item \url{https://dev.mysql.com/doc/} -- Documentation MySQL
    \item \url{https://reactjs.org/} -- Documentation officielle de React
    \item \url{https://tailwindcss.com/} -- Documentation Tailwind CSS
    \item \url{https://docs.djangoproject.com/} -- Documentation Django
\end{itemize}

% Annexes
\chapter*{ANNEXES}
\addcontentsline{toc}{chapter}{ANNEXES}
\label{annexes}

\section*{ANNEXE A : Captures d'écran supplémentaires}
\addcontentsline{toc}{section}{ANNEXE A : Captures d'écran supplémentaires}

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/int1.jpeg}
\caption{Interface de navigation musicale}
\label{fig:capture1}
\end{figure}

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/int2.jpeg}
\caption{Interface de gestion des playlists}
\label{fig:capture2}
\end{figure}

\begin{figure}[h]
\centering
\includegraphics[width=0.8\textwidth]{img/int3.jpeg}
\caption{Interface de profil utilisateur}
\label{fig:capture3}
\end{figure}

\section*{ANNEXE B : Extraits de code ou scripts utiles}
\addcontentsline{toc}{section}{ANNEXE B : Extraits de code ou scripts utiles}

\textbf{Extrait de code Python - Modèle Utilisateur (Django)}

\begin{verbatim}
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/', 
        null=True, 
        blank=True
    )
    
    def _str_(self):
        return self.username

class Playlist(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def _str_(self):
        return f"{self.name} - {self.user.username}"
\end{verbatim}

\textbf{Extrait de code JavaScript - Lecteur Audio}

\begin{verbatim}
class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
    }
    
    play(trackUrl) {
        this.audio.src = trackUrl;
        this.audio.play();
        this.isPlaying = true;
        this.updateUI();
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
    }
    
    updateUI() {
        const playButton = document.getElementById('play-button');
        playButton.textContent = this.isPlaying ? 'Pause' : 'Play';
    }
}
\end{verbatim}

\section*{ANNEXE C : Recommandations et perspectives}
\addcontentsline{toc}{section}{ANNEXE C : Recommandations et perspectives}

Voici quelques pistes d'amélioration et d'extension possibles pour faire évoluer l'application Wavve à l'avenir :

\subsection*{Améliorations techniques}

\begin{itemize}
    \item \textbf{Mode hors ligne} : Permettre aux utilisateurs de télécharger leurs morceaux favoris pour une écoute sans connexion Internet.
    \item \textbf{Optimisation des performances} : Implémenter un système de cache plus sophistiqué et optimiser les requêtes de base de données.
    \item \textbf{Architecture microservices} : Diviser l'application en microservices pour améliorer la scalabilité.
    \item \textbf{Tests automatisés} : Développer une suite de tests unitaires et d'intégration complète.
\end{itemize}

\subsection*{Nouvelles fonctionnalités}

\begin{itemize}
    \item \textbf{Système de commentaires} : Permettre aux utilisateurs de commenter et évaluer les playlists et morceaux.
    \item \textbf{Recommandations IA} : Intégrer des algorithmes d'apprentissage automatique pour des recommandations plus précises.
    \item \textbf{Fonctionnalités sociales} : Ajouter un système de messages privés et de partage sur les réseaux sociaux.
    \item \textbf{Statistiques avancées} : Fournir des analyses détaillées des habitudes d'écoute des utilisateurs.
\end{itemize}

\subsection*{Extensions de plateforme}

\begin{itemize}
    \item \textbf{Application mobile native} : Développer des applications iOS et Android natives.
    \item \textbf{Application desktop} : Créer une application de bureau avec Electron.
    \item \textbf{Intégration APIs multiples} : Connecter Spotify, YouTube Music, Apple Music.
    \item \textbf{Support vocal} : Intégrer des commandes vocales pour une navigation mains libres.
\end{itemize}

\subsection*{Considérations de déploiement}

\begin{itemize}
    \item \textbf{Cloud hosting} : Déployer sur des plateformes comme AWS, Google Cloud ou Heroku.
    \item \textbf{CDN} : Utiliser un réseau de diffusion de contenu pour optimiser les temps de chargement.
    \item \textbf{Monitoring} : Implémenter des outils de surveillance des performances et d'alertes.
    \item \textbf{Sécurité avancée} : Ajouter l'authentification à deux facteurs et le chiffrement des données.
\end{itemize}

Ces recommandations permettraient de transformer Wavve en une plateforme de streaming musical complète et compétitive sur le marché actuel.

\end{document}
