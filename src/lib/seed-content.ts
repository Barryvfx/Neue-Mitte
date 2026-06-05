// Auto-seed content pools. These fill the database automatically when a
// content table is empty, so the site is never blank without manual admin work.

export const WISSENSTEST_POOL = [
  { question: 'Wer wählt den Bundeskanzler bzw. die Bundeskanzlerin?', optionA: 'Der Bundestag', optionB: 'Das Volk direkt', optionC: 'Der Bundespräsident', optionD: 'Der Bundesrat', correct: 'A', category: 'Parlament' },
  { question: 'Wie oft finden reguläre Bundestagswahlen statt?', optionA: 'Alle 3 Jahre', optionB: 'Alle 4 Jahre', optionC: 'Alle 5 Jahre', optionD: 'Alle 6 Jahre', correct: 'B', category: 'Wahlen' },
  { question: 'Wer ist das Staatsoberhaupt der Bundesrepublik Deutschland?', optionA: 'Der Bundeskanzler', optionB: 'Der Bundestagspräsident', optionC: 'Der Bundespräsident', optionD: 'Der Außenminister', correct: 'C', category: 'Allgemein' },
  { question: 'Wie viele Bundesländer hat Deutschland?', optionA: '14', optionB: '15', optionC: '16', optionD: '18', correct: 'C', category: 'Allgemein' },
  { question: 'In welchem Jahr trat das Grundgesetz in Kraft?', optionA: '1945', optionB: '1949', optionC: '1955', optionD: '1990', correct: 'B', category: 'Grundgesetz' },
  { question: 'Was besagt die sogenannte „Fünf-Prozent-Hürde"?', optionA: 'Eine Partei braucht mind. 5 % der Zweitstimmen für den Einzug in den Bundestag', optionB: 'Die Wahlbeteiligung muss über 5 % liegen', optionC: 'Mindestens 5 Parteien müssen antreten', optionD: 'Der Kanzler braucht 5 % Vorsprung', correct: 'A', category: 'Wahlen' },
  { question: 'Welches Gremium wählt den Bundespräsidenten?', optionA: 'Der Bundestag allein', optionB: 'Die Bundesversammlung', optionC: 'Der Bundesrat', optionD: 'Das Bundesverfassungsgericht', correct: 'B', category: 'Allgemein' },
  { question: 'Wie heißt das höchste deutsche Gericht für Verfassungsfragen?', optionA: 'Bundesgerichtshof', optionB: 'Bundesverwaltungsgericht', optionC: 'Bundesverfassungsgericht', optionD: 'Europäischer Gerichtshof', correct: 'C', category: 'Grundgesetz' },
  { question: 'Wofür steht die „Erststimme" bei der Bundestagswahl?', optionA: 'Für eine Partei', optionB: 'Für einen Direktkandidaten im Wahlkreis', optionC: 'Für den Kanzlerkandidaten', optionD: 'Für den Bundespräsidenten', correct: 'B', category: 'Wahlen' },
  { question: 'Wie viele Stimmen hat jede wahlberechtigte Person bei der Bundestagswahl?', optionA: 'Eine', optionB: 'Zwei', optionC: 'Drei', optionD: 'So viele wie Parteien antreten', correct: 'B', category: 'Wahlen' },
  { question: 'Welche Institution vertritt die Bundesländer auf Bundesebene?', optionA: 'Der Bundestag', optionB: 'Der Bundesrat', optionC: 'Die Bundesversammlung', optionD: 'Das Kanzleramt', correct: 'B', category: 'Bundesrat' },
  { question: 'Ab welchem Alter darf man bei Bundestagswahlen wählen?', optionA: '16 Jahre', optionB: '17 Jahre', optionC: '18 Jahre', optionD: '21 Jahre', correct: 'C', category: 'Wahlen' },
  { question: 'Was steht in Artikel 1 des Grundgesetzes?', optionA: 'Alle Menschen sind vor dem Gesetz gleich', optionB: 'Die Würde des Menschen ist unantastbar', optionC: 'Deutschland ist eine Demokratie', optionD: 'Die Pressefreiheit ist garantiert', correct: 'B', category: 'Grundgesetz' },
  { question: 'Welche Farben hat die deutsche Flagge von oben nach unten?', optionA: 'Schwarz-Rot-Gold', optionB: 'Gold-Rot-Schwarz', optionC: 'Rot-Schwarz-Gold', optionD: 'Schwarz-Gold-Rot', correct: 'A', category: 'Allgemein' },
  { question: 'Wie viele Mitgliedsstaaten hat die Europäische Union (Stand 2024)?', optionA: '25', optionB: '27', optionC: '28', optionD: '30', correct: 'B', category: 'EU-Politik' },
  { question: 'Was bedeutet der Begriff „Gewaltenteilung"?', optionA: 'Die Aufteilung des Militärs', optionB: 'Die Trennung von Legislative, Exekutive und Judikative', optionC: 'Die Teilung Deutschlands', optionD: 'Die Aufteilung der Steuern', correct: 'B', category: 'Grundgesetz' },
  { question: 'Wo hat der Deutsche Bundestag seinen Sitz?', optionA: 'Im Kanzleramt', optionB: 'Im Schloss Bellevue', optionC: 'Im Reichstagsgebäude in Berlin', optionD: 'In der Paulskirche', correct: 'C', category: 'Parlament' },
  { question: 'Was versteht man unter einer „Koalition"?', optionA: 'Ein Regierungsbündnis mehrerer Parteien', optionB: 'Eine Wahlkampfveranstaltung', optionC: 'Ein Misstrauensvotum', optionD: 'Eine Volksabstimmung', correct: 'A', category: 'Parteien' },
  { question: 'Welche Aufgabe hat die parlamentarische Opposition?', optionA: 'Die Regierung zu stellen', optionB: 'Den Bundespräsidenten zu wählen', optionC: 'Die Regierung zu kontrollieren und Alternativen aufzuzeigen', optionD: 'Gesetze allein zu beschließen', correct: 'C', category: 'Parlament' },
  { question: 'Wer ernennt formal die Bundesminister?', optionA: 'Der Bundestag', optionB: 'Der Bundespräsident auf Vorschlag des Kanzlers', optionC: 'Der Bundesrat', optionD: 'Die Parteivorsitzenden', correct: 'B', category: 'Allgemein' },
  { question: 'Was beschreibt der Begriff „Föderalismus"?', optionA: 'Die Aufteilung staatlicher Macht zwischen Bund und Ländern', optionB: 'Die Zusammenarbeit in der EU', optionC: 'Ein Wahlsystem', optionD: 'Die Trennung von Kirche und Staat', correct: 'A', category: 'Grundgesetz' },
  { question: 'Welche Währung gilt in Deutschland?', optionA: 'D-Mark', optionB: 'Euro', optionC: 'Franken', optionD: 'Krone', correct: 'B', category: 'Wirtschaft' },
  { question: 'Was ist ein Volksentscheid?', optionA: 'Eine Wahl des Bundespräsidenten', optionB: 'Eine direkte Abstimmung der Bürger über eine Sachfrage', optionC: 'Eine Parteiversammlung', optionD: 'Eine Sitzung des Bundesrates', correct: 'B', category: 'Allgemein' },
  { question: 'In welchem Jahr wurde Deutschland wiedervereinigt?', optionA: '1989', optionB: '1990', optionC: '1991', optionD: '1993', correct: 'B', category: 'Geschichte' },
  { question: 'Was ist die Hauptaufgabe des Bundestages?', optionA: 'Gesetze zu beschließen', optionB: 'Recht zu sprechen', optionC: 'Die Bundeswehr zu führen', optionD: 'Steuern einzutreiben', correct: 'A', category: 'Parlament' },
]

export const FAKTENCHECK_POOL = [
  { claim: 'Deutschland hat eine der höchsten Steuerquoten der Welt.', person: 'Aussage aus sozialen Netzwerken', rating: 'halb-wahr', analysis: 'Die Abgabenquote in Deutschland (Steuern und Sozialbeiträge) liegt im OECD-Vergleich im oberen Drittel, ist aber nicht die höchste. Länder wie Frankreich, Belgien und Dänemark liegen höher. Betrachtet man nur die reine Steuerquote ohne Sozialbeiträge, liegt Deutschland sogar im Mittelfeld.', sources: 'OECD Revenue Statistics 2023\nStatistisches Bundesamt', published: true },
  { claim: 'Erneuerbare Energien decken inzwischen über die Hälfte des deutschen Stromverbrauchs.', person: null, rating: 'wahr', analysis: 'Im Jahr 2023 stammten rund 52 % der in Deutschland verbrauchten Strommenge aus erneuerbaren Quellen. Damit ist die Aussage korrekt. Wichtig: Es geht um den Stromverbrauch, nicht um den gesamten Energieverbrauch (inkl. Wärme und Verkehr), der deutlich niedriger liegt.', sources: 'Umweltbundesamt\nBundesnetzagentur (SMARD)', published: true },
  { claim: 'Der Mindestlohn führt automatisch zu höherer Arbeitslosigkeit.', person: null, rating: 'falsch', analysis: 'Die wissenschaftliche Evidenz zeigt kein automatisches Ansteigen der Arbeitslosigkeit nach Einführung oder Erhöhung des Mindestlohns in Deutschland. Studien des IAB und der Mindestlohnkommission fanden keine signifikanten negativen Beschäftigungseffekte. Die Aussage in dieser pauschalen Form ist nicht belegt.', sources: 'Institut für Arbeitsmarkt- und Berufsforschung (IAB)\nMindestlohnkommission, Berichte', published: true },
  { claim: 'Deutschland gibt mehr für Verteidigung aus als 2 % seines BIP.', person: 'Politische Debatte', rating: 'halb-wahr', analysis: 'Deutschland hat das NATO-Ziel von 2 % des BIP nach jahrelanger Unterschreitung zuletzt unter Einbeziehung des Sondervermögens erreicht bzw. angekündigt. Ob es dauerhaft eingehalten wird, hängt von künftigen Haushalten ab. Die Aussage ist daher nur eingeschränkt und zeitpunktabhängig richtig.', sources: 'NATO Defence Expenditure Reports\nBundesministerium der Verteidigung', published: true },
  { claim: 'Die Bürokratiekosten für deutsche Unternehmen gehen Jahr für Jahr deutlich zurück.', person: null, rating: 'falsch', analysis: 'Das Gegenteil ist näher an der Realität: Verbände wie der Normenkontrollrat weisen seit Jahren auf einen Anstieg des Erfüllungsaufwands hin. Einzelne Entlastungsgesetze gab es, der Gesamttrend ist jedoch nicht eindeutig sinkend.', sources: 'Nationaler Normenkontrollrat, Jahresberichte', published: true },
  { claim: 'In Deutschland herrscht Schulpflicht, kein Recht auf reines Homeschooling.', person: null, rating: 'wahr', analysis: 'In Deutschland gilt eine Präsenzschulpflicht. Reines häusliches Lernen (Homeschooling) ist – anders als in vielen anderen Ländern – grundsätzlich nicht erlaubt und wurde mehrfach höchstrichterlich bestätigt. Die Aussage ist korrekt.', sources: 'Bundesverfassungsgericht, Beschlüsse zur Schulpflicht\nKultusministerkonferenz', published: true },
]

export const VERSPRECHEN_POOL = [
  { title: 'Behördengänge vollständig digitalisieren', description: 'Alle wichtigen Verwaltungsleistungen sollen online verfügbar sein – ohne Papier, ohne Wartezeiten.', status: 'gefordert', category: 'Digitalisierung', order: 1 },
  { title: 'Bürokratie für kleine Unternehmen halbieren', description: 'Berichtspflichten und Genehmigungsverfahren für Selbstständige und KMU drastisch reduzieren.', status: 'diskussion', category: 'Wirtschaft', order: 2 },
  { title: 'Schnelleres Planungs- und Baurecht', description: 'Genehmigungen für Wohnungsbau, Schienen und Energie sollen deutlich schneller erteilt werden.', status: 'gefordert', category: 'Wirtschaft', order: 3 },
  { title: 'Digitale Schule für alle', description: 'Jede Schule mit schnellem Internet, Geräten und Fortbildung für Lehrkräfte ausstatten.', status: 'diskussion', category: 'Bildung', order: 4 },
  { title: 'Steuererklärung in unter 30 Minuten', description: 'Eine vorausgefüllte, verständliche Steuererklärung für Normalverdiener.', status: 'gefordert', category: 'Finanzen', order: 5 },
  { title: 'Stromnetze schneller ausbauen', description: 'Den Netzausbau beschleunigen, damit günstiger Strom dort ankommt, wo er gebraucht wird.', status: 'diskussion', category: 'Energie', order: 6 },
  { title: 'Mehr Tempo bei Einbürgerung qualifizierter Fachkräfte', description: 'Klare, schnelle und faire Verfahren für dringend benötigte Fachkräfte.', status: 'gefordert', category: 'Migration', order: 7 },
  { title: 'Verlässliche Renten ohne Generationenkonflikt', description: 'Ein Rentensystem, das langfristig finanzierbar bleibt und Vertrauen schafft.', status: 'diskussion', category: 'Soziales', order: 8 },
  { title: 'Cybersicherheit für kritische Infrastruktur stärken', description: 'Krankenhäuser, Energieversorger und Verwaltung besser vor Angriffen schützen.', status: 'gefordert', category: 'Sicherheit', order: 9 },
  { title: 'Gründungen in 24 Stunden ermöglichen', description: 'Ein Unternehmen soll an einem Tag rechtssicher gegründet werden können.', status: 'gefordert', category: 'Wirtschaft', order: 10 },
  { title: 'Transparente Staatsausgaben öffentlich einsehbar', description: 'Bürger sollen nachvollziehen können, wofür Steuergeld ausgegeben wird.', status: 'umgesetzt', category: 'Finanzen', order: 11 },
  { title: 'Bezahlbarer Wohnraum in Ballungsräumen', description: 'Mehr Neubau, schnellere Verfahren und faire Mieten in den Städten.', status: 'diskussion', category: 'Soziales', order: 12 },
]

export const BILDUNG_POOL = [
  { title: 'Was ist die Schuldenbremse?', slug: 'was-ist-die-schuldenbremse', summary: 'Eine Regel im Grundgesetz, die die Neuverschuldung des Staates begrenzt.', content: 'Die Schuldenbremse ist seit 2009 im Grundgesetz verankert (Artikel 109 und 115). Sie begrenzt, wie viele neue Schulden Bund und Länder aufnehmen dürfen.\n\nDer Bund darf strukturell nur eine Neuverschuldung von maximal 0,35 % des Bruttoinlandsprodukts pro Jahr aufnehmen. Die Länder dürfen grundsätzlich gar keine neuen strukturellen Schulden machen.\n\nIn Ausnahmesituationen – etwa Naturkatastrophen oder schweren Krisen – kann die Schuldenbremse mit Mehrheit ausgesetzt werden. Befürworter sehen sie als Schutz vor übermäßiger Verschuldung künftiger Generationen, Kritiker bemängeln fehlenden Spielraum für Investitionen.', topic: 'Finanzen', published: true },
  { title: 'Erst- und Zweitstimme einfach erklärt', slug: 'erst-und-zweitstimme-erklaert', summary: 'Warum man bei der Bundestagswahl zwei Stimmen hat und was sie bewirken.', content: 'Bei der Bundestagswahl hat jede wahlberechtigte Person zwei Stimmen.\n\nDie Erststimme wählt eine konkrete Person im eigenen Wahlkreis. Wer die meisten Erststimmen bekommt, zieht direkt in den Bundestag ein (Direktmandat).\n\nDie Zweitstimme ist die wichtigere: Mit ihr wählt man eine Partei. Das Verhältnis der Zweitstimmen entscheidet, wie viele Sitze eine Partei insgesamt im Bundestag erhält.\n\nDeshalb gilt: Die Zweitstimme bestimmt die Machtverhältnisse im Parlament am stärksten.', topic: 'Allgemein', published: true },
  { title: 'Wie entsteht ein Gesetz?', slug: 'wie-entsteht-ein-gesetz', summary: 'Der Weg von der Idee bis zum gültigen Gesetz – Schritt für Schritt.', content: 'Ein Gesetz durchläuft in Deutschland mehrere Stationen.\n\n1. Initiative: Ein Gesetzentwurf kommt von der Bundesregierung, aus dem Bundestag oder vom Bundesrat.\n\n2. Beratung im Bundestag: Der Entwurf wird in mehreren Lesungen diskutiert und in Ausschüssen geprüft.\n\n3. Abstimmung: Der Bundestag stimmt über das Gesetz ab.\n\n4. Bundesrat: Je nach Gesetzestyp muss oder kann der Bundesrat zustimmen.\n\n5. Unterzeichnung: Der Bundespräsident prüft und unterzeichnet das Gesetz, danach wird es verkündet und tritt in Kraft.', topic: 'Allgemein', published: true },
  { title: 'Was bedeutet Inflation?', slug: 'was-bedeutet-inflation', summary: 'Warum Geld an Wert verliert und wer dagegen steuert.', content: 'Inflation bedeutet, dass die Preise für Waren und Dienstleistungen im Durchschnitt steigen. Für dasselbe Geld bekommt man also weniger.\n\nGemessen wird die Inflation über einen „Warenkorb" typischer Ausgaben. Steigt dieser Korb um zum Beispiel 3 % im Jahr, spricht man von 3 % Inflation.\n\nDie Europäische Zentralbank (EZB) strebt mittelfristig rund 2 % Inflation an. Sie steuert über die Leitzinsen: Höhere Zinsen bremsen tendenziell die Inflation, niedrigere fördern Wachstum und Kreditvergabe.', topic: 'Wirtschaft', published: true },
  { title: 'Föderalismus: Wer entscheidet was?', slug: 'foederalismus-wer-entscheidet-was', summary: 'Die Aufgabenteilung zwischen Bund, Ländern und Kommunen.', content: 'Deutschland ist ein föderaler Staat. Das heißt: Die Macht ist zwischen verschiedenen Ebenen aufgeteilt.\n\nDer Bund ist zum Beispiel für Außenpolitik, Verteidigung und Währung zuständig.\n\nDie Länder haben eigene Zuständigkeiten – besonders bei Bildung, Polizei und Kultur. Deshalb gibt es etwa 16 unterschiedliche Schulsysteme.\n\nDie Kommunen (Städte und Gemeinden) kümmern sich um lokale Aufgaben wie Müllabfuhr, Kitas oder Bebauungspläne. Dieses System soll Macht begrenzen und bürgernahe Entscheidungen ermöglichen.', topic: 'Allgemein', published: true },
  { title: 'Was ist die EU und wie funktioniert sie?', slug: 'was-ist-die-eu', summary: 'Ein Überblick über die Europäische Union und ihre wichtigsten Organe.', content: 'Die Europäische Union ist ein Zusammenschluss von 27 europäischen Staaten, die wirtschaftlich und politisch zusammenarbeiten.\n\nWichtige Organe sind: das Europäische Parlament (von den Bürgern gewählt), die Europäische Kommission (eine Art Regierung der EU) und der Rat der EU (die Mitgliedsstaaten).\n\nDie EU sorgt unter anderem für den Binnenmarkt mit freiem Waren- und Personenverkehr sowie für gemeinsame Standards. Viele Mitgliedsstaaten nutzen zudem den Euro als gemeinsame Währung.', topic: 'Allgemein', published: true },
  { title: 'Bürgergeld: Was steckt dahinter?', slug: 'buergergeld-erklaert', summary: 'Grundsicherung in Deutschland – wer sie erhält und wie sie funktioniert.', content: 'Das Bürgergeld ist die Grundsicherung für erwerbsfähige Menschen, die ihren Lebensunterhalt nicht selbst decken können.\n\nEs umfasst einen Regelbedarf für den Lebensunterhalt sowie die Übernahme angemessener Kosten für Unterkunft und Heizung.\n\nIm Gegenzug gelten Mitwirkungspflichten: Wer Bürgergeld bezieht, soll an der Arbeitssuche mitwirken. Über die richtige Balance zwischen Unterstützung und Anreiz zur Arbeitsaufnahme wird politisch viel gestritten.', topic: 'Soziales', published: true },
  { title: 'Wie sicher ist unsere Energieversorgung?', slug: 'energieversorgung-erklaert', summary: 'Strommix, Netze und Versorgungssicherheit verständlich erklärt.', content: 'Die Stromversorgung in Deutschland speist sich aus einem Mix verschiedener Quellen: Wind, Sonne, Gas, Biomasse und Importe.\n\nEine zentrale Herausforderung ist die Schwankung erneuerbarer Energien: Wenn wenig Wind weht und die Sonne nicht scheint, müssen andere Quellen oder Importe einspringen.\n\nDeshalb sind der Ausbau der Stromnetze und Speichertechnologien so wichtig. Sie sorgen dafür, dass Strom dorthin kommt, wo er gebraucht wird – und dass das Netz stabil bleibt.', topic: 'Energie', published: true },
]

export const GESETZ_POOL = [
  { title: 'Das Onlinezugangsgesetz – Verwaltung wird digital', lawName: 'Onlinezugangsgesetz (OZG)', summary: 'Verpflichtet Bund und Länder, Verwaltungsleistungen auch online anzubieten.', content: 'Das Onlinezugangsgesetz soll dafür sorgen, dass Bürgerinnen und Bürger Behördenleistungen digital erledigen können – vom Wohngeldantrag bis zur Kfz-Zulassung.\n\nDie Umsetzung verläuft in der Praxis langsamer als geplant. Viele Leistungen sind noch nicht flächendeckend digital verfügbar, und unterschiedliche Systeme in den Ländern erschweren die Vereinheitlichung.\n\nDie Neue Mitte fordert hier mehr Tempo, einheitliche Standards und echte Nutzerfreundlichkeit statt halbfertiger Online-Formulare.', link: null, published: true },
  { title: 'Das Grundgesetz – unsere Verfassung', lawName: 'Grundgesetz (GG)', summary: 'Die rechtliche Grundlage der Bundesrepublik Deutschland.', content: 'Das Grundgesetz trat 1949 in Kraft und ist die Verfassung Deutschlands. Es legt die Grundrechte fest und beschreibt den Aufbau des Staates.\n\nBesonders bedeutsam sind die ersten 19 Artikel: die Grundrechte. Artikel 1 – „Die Würde des Menschen ist unantastbar" – steht bewusst an erster Stelle.\n\nDas Grundgesetz schützt zudem die Gewaltenteilung, den Föderalismus und die freiheitlich-demokratische Grundordnung. Bestimmte Kernprinzipien dürfen niemals abgeschafft werden (Ewigkeitsklausel, Artikel 79).', link: null, published: true },
  { title: 'Das Fachkräfteeinwanderungsgesetz', lawName: 'Fachkräfteeinwanderungsgesetz', summary: 'Regelt, unter welchen Bedingungen Fachkräfte aus dem Ausland arbeiten dürfen.', content: 'Das Gesetz soll es qualifizierten Menschen aus Nicht-EU-Staaten erleichtern, in Deutschland zu arbeiten – ein Versuch, dem Fachkräftemangel zu begegnen.\n\nEs senkt Hürden bei der Anerkennung von Abschlüssen und schafft Wege wie die „Chancenkarte" mit einem Punktesystem.\n\nKritisch bleibt die praktische Umsetzung: lange Wartezeiten in Behörden und im Visumverfahren bremsen die gewünschte Wirkung. Die Neue Mitte fordert schnellere, digitale Verfahren.', link: null, published: true },
  { title: 'Das Klimaschutzgesetz', lawName: 'Bundes-Klimaschutzgesetz', summary: 'Legt verbindliche Ziele zur Senkung von Treibhausgasen fest.', content: 'Das Klimaschutzgesetz definiert, wie stark Deutschland seine Treibhausgasemissionen senken muss, und gibt Zwischenziele bis zur angestrebten Klimaneutralität vor.\n\nEs verteilt die Verantwortung auf Sektoren wie Verkehr, Gebäude, Industrie und Energie.\n\nUmstritten ist, wie die Ziele konkret erreicht werden sollen, ohne Wirtschaft und Bürger zu überfordern. Die Neue Mitte setzt auf technologieoffene, pragmatische Lösungen statt Verbote.', link: null, published: true },
  { title: 'Das Mindestlohngesetz', lawName: 'Mindestlohngesetz (MiLoG)', summary: 'Garantiert eine gesetzliche Lohnuntergrenze für Beschäftigte.', content: 'Seit 2015 gibt es in Deutschland einen flächendeckenden gesetzlichen Mindestlohn. Er legt fest, wie viel pro Arbeitsstunde mindestens gezahlt werden muss.\n\nDie Höhe wird regelmäßig durch die Mindestlohnkommission überprüft und angepasst. Politische Eingriffe in die Höhe sind möglich, aber umstritten.\n\nZiel ist es, Lohndumping zu verhindern und Vollzeitbeschäftigten ein Auskommen zu sichern. Über die ideale Höhe wird zwischen Sozial- und Wirtschaftsargumenten gerungen.', link: null, published: true },
]

export const TRANSPARENZ_POOL = [
  { title: 'Programm-Schwerpunkte für das laufende Jahr festgelegt', content: 'Die Neue Mitte hat ihre inhaltlichen Schwerpunkte definiert: Digitalisierung der Verwaltung, Bürokratieabbau und bezahlbarer Wohnraum stehen im Mittelpunkt.', category: 'Programm', published: true },
  { title: 'Offenlegung: So finanziert sich die Initiative', content: 'Die Neue Mitte ist ein privates Projekt und finanziert sich ausschließlich aus privaten Mitteln des Initiators. Es werden keine Unternehmensspenden angenommen.', category: 'Finanzen', published: true },
  { title: 'Neue ehrenamtliche Mitstreiter im Team', content: 'Das Team wächst: Mehrere Freiwillige unterstützen nun bei Inhalten, Veranstaltungen und der Betreuung der Online-Plattform.', category: 'Personal', published: true },
  { title: 'Entscheidung: Fokus auf digitale Bürgerbeteiligung', content: 'Es wurde entschieden, verstärkt auf digitale Beteiligungsformate zu setzen – etwa Bürgerfragen, Ideen-Plattform und Debatten-Forum.', category: 'Entscheidung', published: true },
  { title: 'Veröffentlichung aller Datensätze als Open Data', content: 'Ab sofort stehen zentrale Daten der Plattform öffentlich als Download bereit – im Sinne größtmöglicher Transparenz.', category: 'Entscheidung', published: true },
  { title: 'Quartalsrückblick: Was wurde erreicht?', content: 'Im vergangenen Quartal wurden mehrere neue Mitmach-Funktionen veröffentlicht und die Zahl der Unterstützer ist deutlich gewachsen.', category: 'Sonstiges', published: true },
]

export const DEBATTE_POOL = [
  {
    title: 'Sollte es ein generelles Tempolimit auf Autobahnen geben?',
    topic: 'Verkehr',
    args: [
      { text: 'Ein Tempolimit senkt die Zahl schwerer Unfälle und rettet Leben.', seite: 'pro' },
      { text: 'Weniger Tempo bedeutet geringeren Spritverbrauch und weniger CO₂.', seite: 'pro' },
      { text: 'Freie Fahrt ist Teil der individuellen Freiheit und der Reisezeit.', seite: 'contra' },
      { text: 'Der CO₂-Effekt ist im Verhältnis zum Gesamtausstoß gering.', seite: 'contra' },
    ],
  },
  {
    title: 'Sollte das Wahlalter auf 16 Jahre gesenkt werden?',
    topic: 'Demokratie',
    args: [
      { text: 'Junge Menschen sind von politischen Entscheidungen am längsten betroffen.', seite: 'pro' },
      { text: 'Frühe Teilhabe stärkt das demokratische Engagement.', seite: 'pro' },
      { text: 'Mit 16 fehlt vielen noch die nötige politische Reife und Erfahrung.', seite: 'contra' },
      { text: 'Volljährigkeit und Wahlrecht sollten zusammenfallen.', seite: 'contra' },
    ],
  },
  {
    title: 'Brauchen wir mehr Volksentscheide auf Bundesebene?',
    topic: 'Demokratie',
    args: [
      { text: 'Direkte Demokratie bindet Bürger stärker in Entscheidungen ein.', seite: 'pro' },
      { text: 'Wichtige Fragen sollten nicht nur von Parlamenten entschieden werden.', seite: 'pro' },
      { text: 'Komplexe Themen lassen sich nicht auf Ja/Nein reduzieren.', seite: 'contra' },
      { text: 'Es besteht die Gefahr von populistischen Kampagnen.', seite: 'contra' },
    ],
  },
  {
    title: 'Sollte die Verwaltung vollständig digitalisiert werden?',
    topic: 'Digitalisierung',
    args: [
      { text: 'Digitale Behörden sparen Zeit, Geld und Nerven.', seite: 'pro' },
      { text: 'Andere Länder zeigen, dass es schnell und sicher geht.', seite: 'pro' },
      { text: 'Nicht alle Menschen kommen mit rein digitalen Angeboten zurecht.', seite: 'contra' },
      { text: 'Datenschutz und IT-Sicherheit müssen erst gewährleistet sein.', seite: 'contra' },
    ],
  },
  {
    title: 'Sollte Deutschland mehr in Verteidigung investieren?',
    topic: 'Sicherheit',
    args: [
      { text: 'Eine glaubwürdige Verteidigung sichert Frieden und Bündnisfähigkeit.', seite: 'pro' },
      { text: 'Jahrelange Unterfinanzierung hat Lücken hinterlassen.', seite: 'pro' },
      { text: 'Das Geld fehlt dann bei Bildung, Sozialem und Infrastruktur.', seite: 'contra' },
      { text: 'Mehr Ausgaben bedeuten nicht automatisch mehr Sicherheit.', seite: 'contra' },
    ],
  },
]

export const GLOSSAR_POOL = [
  { term: 'Abstimmung', definition: 'Förmliche Entscheidung durch Mehrheitsbeschluss in einem Gremium oder der Bevölkerung.', category: 'Parlament', letter: 'A' },
  { term: 'Ausschuss', definition: 'Kleines Arbeitsgremium des Bundestags, das Gesetzentwürfe vorberät und Experten anhört.', category: 'Parlament', letter: 'A' },
  { term: 'Bundeskanzler', definition: 'Regierungschef der Bundesrepublik Deutschland, vom Bundestag gewählt und für die Richtlinien der Politik verantwortlich.', category: 'Exekutive', letter: 'B' },
  { term: 'Bundesrat', definition: 'Organ, durch das die 16 Bundesländer an der Gesetzgebung des Bundes mitwirken.', category: 'Verfassung', letter: 'B' },
  { term: 'Bundestag', definition: 'Volksvertretung der Bundesrepublik Deutschland mit 736 Abgeordneten; oberstes Gesetzgebungsorgan.', category: 'Parlament', letter: 'B' },
  { term: 'Demokratie', definition: 'Staatsform, in der die politische Macht vom Volk ausgeht und durch gewählte Vertreter ausgeübt wird.', category: 'Grundbegriffe', letter: 'D' },
  { term: 'Direktwahl', definition: 'Wahl, bei der Bürger unmittelbar ihre Vertreter bestimmen, ohne Vermittlung durch Wahlmänner.', category: 'Wahlen', letter: 'D' },
  { term: 'Filibuster', definition: 'Taktik in parlamentarischen Systemen, bei der durch endlose Reden eine Abstimmung verzögert wird.', category: 'Parlament', letter: 'F' },
  { term: 'Föderalismus', definition: 'Staatsaufbau, bei dem Aufgaben zwischen Bund und Ländern aufgeteilt sind.', category: 'Verfassung', letter: 'F' },
  { term: 'Fraktion', definition: 'Zusammenschluss von Abgeordneten gleicher oder ähnlicher politischer Überzeugung im Parlament.', category: 'Parlament', letter: 'F' },
  { term: 'Gewaltenteilung', definition: 'Prinzip der Aufteilung staatlicher Macht in Legislative, Exekutive und Judikative zur gegenseitigen Kontrolle.', category: 'Verfassung', letter: 'G' },
  { term: 'Grundgesetz', definition: 'Die Verfassung der Bundesrepublik Deutschland; in Kraft seit 23. Mai 1949.', category: 'Verfassung', letter: 'G' },
  { term: 'Haushalt', definition: 'Plan über alle Einnahmen und Ausgaben des Staates für ein Haushaltsjahr.', category: 'Finanzen', letter: 'H' },
  { term: 'Immunität', definition: 'Schutz von Abgeordneten vor Strafverfolgung ohne Genehmigung des Parlaments.', category: 'Parlament', letter: 'I' },
  { term: 'Koalition', definition: 'Regierungsbündnis mehrerer Parteien, die zusammen eine Mehrheit im Parlament bilden.', category: 'Regierung', letter: 'K' },
  { term: 'Koalitionsvertrag', definition: 'Schriftliche Vereinbarung zwischen Koalitionsparteien über gemeinsame Regierungsziele.', category: 'Regierung', letter: 'K' },
  { term: 'Konstruktives Misstrauensvotum', definition: 'Abwahl des Bundeskanzlers durch den Bundestag nur, wenn gleichzeitig ein Nachfolger gewählt wird (Art. 67 GG).', category: 'Verfassung', letter: 'K' },
  { term: 'Legislative', definition: 'Gesetzgebende Gewalt; in Deutschland hauptsächlich der Bundestag.', category: 'Verfassung', letter: 'L' },
  { term: 'Lobbyismus', definition: 'Einflussnahme von Interessengruppen auf politische Entscheidungen und Gesetzgebung.', category: 'Politik', letter: 'L' },
  { term: 'Mandat', definition: 'Auftrag und Berechtigung eines gewählten Abgeordneten, das Volk zu vertreten.', category: 'Wahlen', letter: 'M' },
  { term: 'Mehrheitswahl', definition: 'Wahlsystem, bei dem derjenige Kandidat gewinnt, der die meisten Stimmen erhält.', category: 'Wahlen', letter: 'M' },
  { term: 'Opposition', definition: 'Parteien im Parlament, die nicht der Regierung angehören und diese kontrollieren.', category: 'Parlament', letter: 'O' },
  { term: 'Parlament', definition: 'Volksvertretung; in Deutschland der Bundestag als zentrale demokratische Institution.', category: 'Grundbegriffe', letter: 'P' },
  { term: 'Petition', definition: 'Formelle Eingabe an Behörden oder Parlamente mit einer Bitte oder Forderung.', category: 'Bürgerrechte', letter: 'P' },
  { term: 'Plenum', definition: 'Vollversammlung aller Abgeordneten des Bundestags.', category: 'Parlament', letter: 'P' },
  { term: 'Rechtsstaat', definition: 'Staatsprinzip, das Herrschaft des Rechts, Grundrechtsbindung und Gewaltenteilung garantiert.', category: 'Verfassung', letter: 'R' },
  { term: 'Republik', definition: 'Staatsform ohne Monarchie; höchste Staatsämter sind nicht erblich, sondern gewählt.', category: 'Grundbegriffe', letter: 'R' },
  { term: 'Subsidiarität', definition: 'Prinzip, dass Aufgaben möglichst auf der niedrigsten staatlichen Ebene gelöst werden sollen.', category: 'Verfassung', letter: 'S' },
  { term: 'Überhangmandat', definition: 'Zusatzsitz im Bundestag, wenn eine Partei mehr Direktmandate als Listenplätze gewinnt.', category: 'Wahlen', letter: 'Ü' },
  { term: 'Verhältniswahl', definition: 'Wahlsystem, bei dem Parteien entsprechend ihrem Stimmenanteil Sitze im Parlament erhalten.', category: 'Wahlen', letter: 'V' },
  { term: 'Vertrauensfrage', definition: 'Frage des Bundeskanzlers an den Bundestag, ob dieser ihm noch das Vertrauen ausspricht (Art. 68 GG).', category: 'Verfassung', letter: 'V' },
  { term: 'Veto', definition: 'Einspruchsrecht gegen Beschlüsse; der Bundesrat kann bei zustimmungspflichtigen Gesetzen ein Veto einlegen.', category: 'Verfassung', letter: 'V' },
  { term: 'Volkssouveränität', definition: 'Grundsatz, dass alle Staatsgewalt vom Volk ausgeht (Art. 20 Abs. 2 GG).', category: 'Verfassung', letter: 'V' },
  { term: 'Wahlrecht', definition: 'Recht der Bürger, an Wahlen teilzunehmen; in Deutschland ab 18 Jahren, aktiv und passiv.', category: 'Bürgerrechte', letter: 'W' },
  { term: 'Weizsäcker-Rede', definition: 'Bedeutende Rede des Bundespräsidenten Richard von Weizsäcker am 8. Mai 1985, die den Kriegsende als Befreiung bezeichnete.', category: 'Geschichte', letter: 'W' },
  { term: 'Zweitstimme', definition: 'Wahlstimme für eine Parteiliste bei der Bundestagswahl; bestimmt das Kräfteverhältnis im Parlament.', category: 'Wahlen', letter: 'Z' },
]

export const ZITAT_POOL = [
  { text: 'Die Würde des Menschen ist unantastbar.', author: 'Grundgesetz Art. 1', year: 1949, context: 'Verfassung der Bundesrepublik Deutschland', category: 'Demokratie' },
  { text: 'Alle Staatsgewalt geht vom Volke aus.', author: 'Grundgesetz Art. 20', year: 1949, context: 'Verfassung der Bundesrepublik Deutschland', category: 'Demokratie' },
  { text: 'Freiheit ist immer auch die Freiheit der Andersdenkenden.', author: 'Rosa Luxemburg', year: 1918, context: 'Zur Russischen Revolution', category: 'Freiheit' },
  { text: 'Demokratie ist die schlechteste aller Regierungsformen – abgesehen von allen anderen.', author: 'Winston Churchill', year: 1947, context: 'Rede im britischen Unterhaus', category: 'Demokratie' },
  { text: 'Wer für die Freiheit kämpft, hat immer Recht.', author: 'Bertolt Brecht', year: null, context: null, category: 'Freiheit' },
  { text: 'Der Staat bin ich nicht – der Staat sind wir alle.', author: 'Theodor Heuss', year: 1949, context: 'Erste Rede als Bundespräsident', category: 'Demokratie' },
  { text: 'Politik ist die Kunst des Möglichen.', author: 'Otto von Bismarck', year: 1867, context: 'Gespräch mit Friedrich Meyer von Waldeck', category: 'Politik' },
  { text: 'Nicht wer Recht hat, siegt; sondern wer siegt, hat Recht. Das darf in einer Demokratie nicht so sein.', author: 'Gustav Heinemann', year: null, context: null, category: 'Demokratie' },
  { text: 'Wer in der Demokratie schläft, wacht in der Diktatur auf.', author: 'Friedrich Ebert', year: null, context: null, category: 'Demokratie' },
  { text: 'Ich habe gelernt: Mut ist nicht die Abwesenheit von Angst, sondern das Urteil, dass etwas anderes wichtiger ist als die Angst.', author: 'Ambrose Redmoon', year: null, context: null, category: 'Mut' },
  { text: 'In der Demokratie ist der Bürger der Souverän – kein Politiker, kein Beamter, kein Richter.', author: 'Roman Herzog', year: null, context: null, category: 'Demokratie' },
  { text: 'Die gefährlichste aller Weltanschauungen ist die Weltanschauung der Leute, welche die Welt nie angeschaut haben.', author: 'Alexander von Humboldt', year: null, context: null, category: 'Bildung' },
  { text: 'Wenn alle dasselbe denken, denkt keiner viel.', author: 'Walter Lippmann', year: null, context: null, category: 'Denken' },
  { text: 'Fortschritt ist nicht möglich ohne Veränderung, und wer seine Meinung nicht ändern kann, kann auch nichts verändern.', author: 'George Bernard Shaw', year: null, context: null, category: 'Wandel' },
  { text: 'Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.', author: 'Eleanor Roosevelt', year: null, context: null, category: 'Zukunft' },
  { text: 'Frag nicht, was dein Land für dich tun kann – frag, was du für dein Land tun kannst.', author: 'John F. Kennedy', year: 1961, context: 'Antrittsrede als US-Präsident', category: 'Engagement' },
  { text: 'Ich habe einen Traum – einen Traum, tief verwurzelt im amerikanischen Traum.', author: 'Martin Luther King Jr.', year: 1963, context: 'March on Washington', category: 'Freiheit' },
  { text: 'Nur wer sich ändert, bleibt sich treu.', author: 'Wolf Biermann', year: null, context: null, category: 'Wandel' },
  { text: 'Die Kunst der Staatsführung besteht darin, so viel Steuern wie möglich einzutreiben, ohne das Volk dabei arm zu machen.', author: 'Jean-Baptiste Colbert', year: null, context: null, category: 'Wirtschaft' },
  { text: 'Was nützt es einem Menschen, wenn er die ganze Welt gewinnt, aber Schaden nimmt an seiner Seele?', author: 'Matthäus 16:26', year: null, context: 'Neues Testament', category: 'Werte' },
  { text: 'Tue nichts heimlich, was du nicht auch öffentlich tun könntest.', author: 'Marcus Aurelius', year: null, context: 'Selbstbetrachtungen', category: 'Integrität' },
  { text: 'Bildung ist die mächtigste Waffe, die du benutzen kannst, um die Welt zu verändern.', author: 'Nelson Mandela', year: null, context: null, category: 'Bildung' },
  { text: 'Das Gefährliche an der Politik ist, dass man anfängt zu glauben, man sei unverzichtbar.', author: 'Helmut Schmidt', year: null, context: null, category: 'Politik' },
  { text: 'Gemeinwohl vor Eigennutz.', author: 'Grundsatz des Grundgesetzes', year: 1949, context: null, category: 'Werte' },
  { text: 'Wir sind alle verantwortlich für alles und alle.', author: 'Fjodor Dostojewski', year: null, context: null, category: 'Verantwortung' },
]

export const ABSTIMMUNG_POOL = [
  { question: 'Soll Deutschland ein Tempolimit auf Autobahnen einführen?', context: 'Deutschland ist eines der wenigen Länder ohne generelles Autobahn-Tempolimit. Befürworter sehen Vorteile bei Sicherheit und CO₂-Emissionen, Gegner betonen die Tradition und wirtschaftliche Freiheit.', category: 'Verkehr' },
  { question: 'Soll die Wehrpflicht in Deutschland wieder eingeführt werden?', context: 'Die Wehrpflicht wurde 2011 ausgesetzt. Angesichts geopolitischer Veränderungen diskutiert Deutschland verschiedene Modelle der Wehrertüchtigung.', category: 'Sicherheit' },
  { question: 'Soll Wahlrecht ab 16 Jahren bundesweit gelten?', context: 'In einigen Bundesländern dürfen 16-Jährige bereits bei Landtagswahlen wählen. Eine Absenkung auf Bundesebene wird kontrovers diskutiert.', category: 'Demokratie' },
  { question: 'Soll der öffentlich-rechtliche Rundfunk reformiert werden?', context: 'ARD, ZDF und Co. werden durch Rundfunkbeiträge finanziert. Kritiker fordern Schlankung und Konzentration auf den Kernauftrag, Befürworter betonen die demokratische Bedeutung.', category: 'Medien' },
  { question: 'Soll Deutschland schneller aus der Kohleenergie aussteigen?', context: 'Der aktuelle Plan sieht ein Kohleausstieg bis 2038 vor. Klimaschützer fordern 2030, Industrieregionen mahnen zur Vorsicht beim sozialen Wandel.', category: 'Energie' },
  { question: 'Soll Homeoffice ein gesetzliches Recht für alle Arbeitnehmer werden?', context: 'Während der Pandemie arbeiteten Millionen im Homeoffice. Ob dies ein Rechtsanspruch werden soll, ist umstritten zwischen Arbeitgeber- und Arbeitnehmerseite.', category: 'Arbeit' },
  { question: 'Soll Cannabis in Deutschland legal bleiben?', context: 'Die Teillegalisierung von Cannabis trat 2024 in Kraft. Kritiker fordern Rücknahme, Befürworter sehen erste positive Effekte beim kontrollierten Konsum.', category: 'Gesellschaft' },
  { question: 'Soll die Schuldenbremse dauerhaft reformiert werden?', context: 'Die im Grundgesetz verankerte Schuldenbremse begrenzt staatliche Kreditaufnahme. Kritiker sehen sie als Investitionshindernis, Befürworter als wichtige Haushaltsdisziplin.', category: 'Finanzen' },
  { question: 'Soll der Bundestag dauerhaft auf unter 600 Abgeordnete verkleinert werden?', context: 'Der Bundestag umfasst aktuell 736 Sitze. Das neue Wahlrecht soll die Größe begrenzen, aber die Umsetzung ist verfassungsrechtlich umstritten.', category: 'Demokratie' },
  { question: 'Soll Deutschland mehr Mittel für Entwicklungshilfe bereitstellen?', context: 'Deutschland gibt etwa 0,7% des Bruttonationaleinkommens für Entwicklungszusammenarbeit aus. Angesichts globaler Herausforderungen diskutieren Experten über die richtige Höhe.', category: 'Außenpolitik' },
]

// Rotating hero headlines — the big text changes automatically on the homepage.
export const HERO_HEADLINES: { headline: string[]; sub: string }[] = [
  { headline: ['Deutschland', 'kann mehr.'], sub: 'Die Neue Mitte kämpft für schnellere Behörden, moderne Schulen, weniger Bürokratie und einen Staat, der Probleme löst statt verwaltet.' },
  { headline: ['Gemeinsam.', 'Pragmatisch. Neu.'], sub: 'Die Neue Mitte steht für eine Politik, die liefert: Weniger Ideologie, mehr Lösungen – für Deutschland und seine Bürger.' },
  { headline: ['Schluss mit', 'Stillstand.'], sub: 'Wir wollen ein Land, das schneller entscheidet, mutiger investiert und seinen Bürgern wieder vertraut.' },
  { headline: ['Politik, die', 'funktioniert.'], sub: 'Keine leeren Versprechen, sondern konkrete Lösungen für die echten Probleme im Alltag der Menschen.' },
  { headline: ['Die Mitte.', 'Wieder stark.'], sub: 'Pragmatisch, lösungsorientiert und glaubwürdig – für alle, die genug von Lagerdenken und Blockaden haben.' },
  { headline: ['Weniger reden.', 'Mehr machen.'], sub: 'Deutschland braucht Tempo: bei der Digitalisierung, beim Bauen, bei der Bildung und in der Verwaltung.' },
  { headline: ['Dein Land.', 'Deine Stimme.'], sub: 'Mach mit, stell Fragen, bring Ideen ein – gestalte mit uns eine Politik, die wieder beim Bürger ankommt.' },
  { headline: ['Vernunft', 'statt Lager.'], sub: 'Die besten Ideen kommen aus der Mitte. Wir verbinden wirtschaftliche Vernunft mit sozialer Verantwortung.' },
]
