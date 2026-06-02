export interface ProgramSection {
  heading: string
  body: string
}

export interface ProgramArea {
  title: string
  slug: string
  subtitle: string
  intro: string
  sections: ProgramSection[]
  demands: string[]
  conclusion: string
}

export const PROGRAM_AREAS: ProgramArea[] = [
  {
    title: 'Wirtschaft & Wettbewerb',
    slug: 'wirtschaft',
    subtitle: 'Für eine Wirtschaft, die Menschen und Unternehmen gleichermaßen trägt.',
    intro: 'Deutschland ist eine der größten Volkswirtschaften der Welt – und verliert dennoch zunehmend an Boden. Unternehmen verlagern Produktionsstätten ins Ausland, Fachkräfte wandern ab, und die Bürokratie frisst einen wachsenden Teil der produktiven Energie auf. Die Neue Mitte sieht Wirtschaftspolitik nicht als Selbstzweck, sondern als Voraussetzung für einen handlungsfähigen Staat, für soziale Sicherheit und für individuelle Chancen.',
    sections: [
      {
        heading: 'Die Lage ist ernster, als sie erscheint',
        body: 'Die Wettbewerbsfähigkeit des Standorts Deutschland hat in den vergangenen Jahren spürbar gelitten. Hohe Energiepreise, komplexe Regulierung, langsame Genehmigungsverfahren und ein Steuersystem, das international kaum wettbewerbsfähig ist, treiben Unternehmen in andere Länder. Das ist keine abstrakte Klage von Unternehmensverbänden – es sind konkrete Entscheidungen, die jeden Tag getroffen werden und die mittel- bis langfristig unseren Wohlstand gefährden. Gleichzeitig leidet der Mittelstand, das Rückgrat der deutschen Wirtschaft, unter Bürokratielasten, die kleine Betriebe überproportional treffen.',
      },
      {
        heading: 'Steuern als Standortfaktor',
        body: 'Deutschland besteuert Unternehmensgewinne im internationalen Vergleich überdurchschnittlich. Mit kombinierter Körperschaft- und Gewerbesteuer liegt die effektive Steuerlast für viele mittelständische Betriebe bei 28 bis 32 Prozent – weit über dem EU-Durchschnitt. Die Neue Mitte will die Körperschaftsteuer auf 15 Prozent absenken, die Gewerbesteuer reformieren und gleichzeitig Steuerschlupflöcher für Großkonzerne schließen. Steuerentlastung für diejenigen, die Arbeitsplätze schaffen und Risiken eingehen – nicht für diejenigen, die Gewinne international verschieben.',
      },
      {
        heading: 'Mittelstand stärken, Großkonzerne nicht bevorzugen',
        body: 'Die deutsche Wirtschaftspolitik neigt dazu, Probleme von Großkonzernen mit staatlichem Geld zu lösen, während kleine und mittlere Unternehmen mit ihren Problemen allein gelassen werden. Die Neue Mitte lehnt staatliche Unternehmensrettungen als Regelfall ab. Wer wirtschaftliche Risiken eingeht, muss auch mit den Konsequenzen leben. Öffentliche Mittel sollen gezielt in Infrastruktur, Forschungsförderung und die Entlastung des Mittelstands fließen – nicht in die Subventionierung von Fehlinvestitionen.',
      },
      {
        heading: 'Bürokratie als wirtschaftliches Problem',
        body: 'Deutschland liegt bei internationalen Bürokratie-Rankings regelmäßig auf hinteren Plätzen. Unternehmensgründungen dauern Wochen, Baugenehmigungen Jahre, Förderprogramme scheitern an ihrer eigenen Komplexität. Die Neue Mitte fordert ein verbindliches Prinzip: Für jede neue Vorschrift werden zwei abgeschafft. Außerdem wollen wir Genehmigungsverfahren digitalisieren und gesetzliche Höchstfristen einführen, nach denen Anträge als genehmigt gelten, wenn keine Entscheidung erfolgt ist.',
      },
      {
        heading: 'Fachkräfte gewinnen und halten',
        body: 'Deutschland hat zu wenige Fachkräfte und macht es zu kompliziert, neue zu gewinnen. Ausländische Qualifikationen werden zu langsam anerkannt, Visumverfahren dauern zu lange, Sprachkurse sind unterfinanziert. Gleichzeitig verlassen qualifizierte Deutsche das Land, weil andere Standorte attraktiver erscheinen. Wir wollen die Fachkräfteeinwanderung praktisch und schnell gestalten: Anerkennungsverfahren innerhalb von drei Monaten, digitale Antragstellung, aufsuchende Beratung für Zuwanderer. Wer arbeitet und Steuern zahlt, soll in Deutschland willkommen sein.',
      },
    ],
    demands: [
      'Körperschaftsteuer auf 15 Prozent absenken',
      'Für jede neue Vorschrift zwei abschaffen (One-in-two-out)',
      'Genehmigungsverfahren digitalisieren und mit Höchstfristen versehen',
      'Staatliche Unternehmensrettungen auf absolute Ausnahmefälle begrenzen',
      'Anerkennungsverfahren für ausländische Qualifikationen innerhalb von 90 Tagen',
      'Forschungsförderung für KMU bürokratiearm gestalten',
    ],
    conclusion: 'Wirtschaftspolitik der Neuen Mitte ist keine Politik für Konzerne oder für Ideologen. Sie ist eine Politik für Handwerkerinnen, Gründer, Ingenieure und Kaufleute – für all jene, die täglich etwas aufbauen, riskieren und zum Wohlstand aller beitragen.',
  },
  {
    title: 'Steuern & Staatsfinanzen',
    slug: 'steuern',
    subtitle: 'Einfache Steuern, gerechte Lasten, transparente Ausgaben.',
    intro: 'Das deutsche Steuersystem ist eines der komplexesten der Welt. Es belastet Arbeitnehmer der Mittelschicht unverhältnismäßig stark, begünstigt Kapitalerträge gegenüber Arbeitseinkommen und ist für viele Menschen ohne professionelle Hilfe nicht handhabbar. Die Neue Mitte will ein Steuersystem, das einfach, gerecht und verständlich ist.',
    sections: [
      {
        heading: 'Die Mittelschicht entlasten',
        body: 'Der sogenannte Mittelstandsbauch im deutschen Einkommensteuertarif ist eines der deutlichsten Zeichen für eine unausgewogene Steuerpolitik. Arbeitnehmer mit mittleren Einkommen zahlen einen überproportional hohen Grenzsteuersatz, während sehr hohe und sehr niedrige Einkommen relativ bessergestellt sind. Die Neue Mitte will den Einkommensteuertarif grundlegend vereinfachen: Freibetrag, ein moderater Grundsatz und ein höherer Spitzensteuersatz erst bei wirklich hohen Einkommen. Ziel ist es, dass Menschen mit Durchschnittsgehältern spürbar mehr Netto vom Brutto haben.',
      },
      {
        heading: 'Kapital- und Arbeitseinkommen gerechter behandeln',
        body: 'Es kann nicht sein, dass Kapitalerträge pauschal mit 25 Prozent besteuert werden, während Arbeitnehmer mit mittlerem Einkommen effektiv mehr zahlen. Wir wollen die Abgeltungsteuer reformieren und Kapitalerträge wieder dem persönlichen Steuersatz unterwerfen – mit einem erhöhten Sparerfreibetrag, um kleine Sparer zu schützen. Gleichzeitig wollen wir die Erbschaftsteuer so gestalten, dass sie echte Vermögenskonzentration trifft, aber Familienunternehmen und selbst genutztes Wohneigentum nicht gefährdet.',
      },
      {
        heading: 'Transparenz bei Staatsausgaben',
        body: 'Der Staat kann nur dann das Vertrauen der Bevölkerung zurückgewinnen, wenn Bürgerinnen und Bürger nachvollziehen können, wofür ihr Geld verwendet wird. Die Neue Mitte fordert ein nationales Transparenzregister: Alle Staatsausgaben ab 50.000 Euro werden online veröffentlicht, durchsuchbar und maschinenlesbar. Förderbescheide, Beraterverträge, Subventionen – alles muss nachvollziehbar sein. Das ist in anderen Ländern längst Standard.',
      },
      {
        heading: 'Schuldenbremse mit Ausnahmen für echte Investitionen',
        body: 'Die Neue Mitte bekennt sich zur fiskalischen Disziplin. Schulden, die für konsumtive Ausgaben aufgenommen werden, belasten künftige Generationen ohne Gegenleistung. Gleichzeitig erkennen wir an, dass Investitionen in Infrastruktur, Bildung und Digitalisierung langfristige Renditen haben. Wir wollen die Schuldenbremse um eine klar definierte Investitionsausnahme ergänzen – keine Umgehung durch umdefinierte Sondervermögen, sondern eine transparente Regelung mit parlamentarischer Kontrolle.',
      },
    ],
    demands: [
      'Einkommensteuertarif vereinfachen und Mittelstandsbauch abflachen',
      'Abgeltungsteuer reformieren: Kapitalerträge wieder nach persönlichem Steuersatz',
      'Transparenzregister für alle Staatsausgaben ab 50.000 Euro',
      'Schuldenbremse um klare Investitionsausnahme ergänzen',
      'Steuererklärungs-Pflicht für einfache Fälle abschaffen (vorausgefüllte Erklärung)',
    ],
    conclusion: 'Wer fair bezahlt, bekommt auch Vertrauen zurück. Ein einfaches, gerechtes Steuersystem ist die Grundlage dafür, dass Bürgerinnen und Bürger den Staat als Partner und nicht als Gegner erleben.',
  },
  {
    title: 'Bildung & Chancengleichheit',
    slug: 'bildung',
    subtitle: 'Gleiche Chancen, praxisnahe Inhalte, einheitliche Standards.',
    intro: 'Bildung ist die wichtigste Investition, die ein Staat tätigen kann. Und dennoch: Das deutsche Bildungssystem reproduziert soziale Ungleichheit, bereitet Schülerinnen und Schüler unzureichend auf das echte Leben vor und leidet unter einem strukturellen Föderalismus-Problem, das zu 16 verschiedenen Bildungssystemen auf engstem Raum geführt hat. Die Neue Mitte will Bildungspolitik, die alle meint.',
    sections: [
      {
        heading: 'Das Bildungssystem versagt bei der Chancengleichheit',
        body: 'Kein anderes entwickeltes Land hat eine so starke Korrelation zwischen dem Bildungsabschluss der Eltern und dem der Kinder wie Deutschland. Wer in einer Akademikerfamilie aufwächst, hat statistisch gesehen eine vielfach höhere Chance auf Abitur und Studium als gleichbegabte Kinder aus bildungsfernen Haushalten. Das ist keine unvermeidliche Naturkonstante – es ist das Ergebnis von politischen Entscheidungen, die wir ändern können und müssen.',
      },
      {
        heading: 'Was Schulen nicht lehren, obwohl sie es sollten',
        body: 'Millionen von Deutschen scheitern an der Steuererklärung, verstehen ihre Rentenauskunft nicht, kennen weder Zinseszins noch Inflation und können keine fundierte finanzielle Entscheidung treffen. Informatik bleibt in vielen Bundesländern ein Wahlfach oder fällt schlicht aus. Wir wollen Finanzbildung, Steuererklärung, Grundlagen der Geldanlage und Informatik als verpflichtende Unterrichtsfächer einführen – nicht als Addition zu einem übervollen Lehrplan, sondern als Ersatz für Inhalte, die im Zeitalter der Digitalisierung anachronistisch sind.',
      },
      {
        heading: 'Bundesweit einheitliche Standards',
        body: 'Ein Abitur in Bayern ist nicht dasselbe wie ein Abitur in Bremen. Das weiß jeder, der Hochschulzulassungsverfahren verfolgt oder selbst umgezogen ist. Die Bildungshoheit der Länder ist politisch geschützt, aber pädagogisch nicht immer sinnvoll. Die Neue Mitte fordert ein nationales Bildungsrahmengesetz: Kernlehrpläne, gemeinsame Abiturstandards und Mindestanforderungen an Schulgebäude, Lehrmaterial und Digitalisierung. Innerhalb dieses Rahmens sollen Länder und Schulen weiterhin Freiheit haben.',
      },
      {
        heading: 'Weniger Auswendiglernen, mehr Anwenden',
        body: 'Das deutsche Bildungssystem testet zu häufig das Auswendiglernen und zu selten das Denken. Projektorientiertes Lernen, Teamarbeit, kritische Analyse und das Lösen von Problemen ohne vorgegebene Antwort sind Fähigkeiten, die in modernen Arbeitsmärkten entscheidend sind und im Schulsystem kaum gefördert werden. Wir wollen eine schrittweise Reform der Prüfungsformate und Lehrplaninhalte, die echte Kompetenzen in den Mittelpunkt stellt.',
      },
    ],
    demands: [
      'Finanzbildung und Steuererklärung als Pflichtfächer ab Klasse 9',
      'Informatik als Pflichtfach ab Klasse 5 in allen Bundesländern',
      'Bundesweit einheitliches Abiturniveau durch nationalen Bildungsrahmen',
      'Digitale Endgeräte und schnelles Internet für jede Schule bis 2026',
      'Begabtenförderung unabhängig vom sozioökonomischen Hintergrund',
      'Reform der Prüfungsformate hin zu anwendungsorientierten Kompetenztests',
    ],
    conclusion: 'Bildung ist kein Luxus. Sie ist das entscheidende Instrument dafür, dass jedes Kind unabhängig von Herkunft, Wohnort und Elternhaus eine echte Chance bekommt. Daran muss sich jede Bildungspolitik messen lassen.',
  },
  {
    title: 'Gesundheit & Pflege',
    slug: 'gesundheit',
    subtitle: 'Ein Gesundheitssystem, das für alle funktioniert.',
    intro: 'Deutschland gibt im internationalen Vergleich sehr viel Geld für Gesundheitsversorgung aus – und erzielt dennoch nicht die bestmöglichen Ergebnisse. Lange Wartezeiten, überlastetes Pflegepersonal, Qualitätsunterschiede zwischen Kassenpatient und Privatpatient und zu wenige Medizinstudienplätze sind strukturelle Probleme, die politisch lösbar sind.',
    sections: [
      {
        heading: 'Zwei-Klassen-Medizin überwinden',
        body: 'Wer eine private Krankenversicherung hat, bekommt in Deutschland schneller einen Termin beim Facharzt, wird bevorzugt behandelt und zahlt implizit für ein System, das die öffentliche Versorgung aushöhlt. Die Neue Mitte fordert keine Abschaffung der privaten Krankenversicherung, aber eine Angleichung der Vergütungsstrukturen, sodass Kassenpatientinnen und -patienten nicht systematisch benachteiligt werden. Wer auf einen Facharzttermin drei Monate warten muss, ist nicht gut versorgt.',
      },
      {
        heading: 'Mehr Medizinstudienplätze',
        body: 'Deutschland bildet zu wenige Ärztinnen und Ärzte aus. Die numerus-clausus-basierte Zulassung zum Medizinstudium ist ein Relikt aus einer Zeit, in der Studienplätze vor allem durch Kapazitätsengpässe begrenzt waren. Heute sind die Engpässe politischer Natur. Wir wollen die Zahl der Medizinstudienplätze innerhalb von zehn Jahren um 30 Prozent erhöhen und gleichzeitig die Zulassungskriterien weiterentwickeln: soziale Kompetenz und praktische Eignung sollen genauso zählen wie Abiturnoten.',
      },
      {
        heading: 'Pflege aufwerten',
        body: 'Pflegekräfte leisten unverzichtbare Arbeit unter schwierigen Bedingungen für unterdurchschnittliche Löhne. Das Ergebnis: Pflegeberufe sind unattraktiv, die Versorgungslage verschlechtert sich. Die Neue Mitte will tarifliche Mindestlöhne in der Pflege, eine konsequente Entbürokratisierung der Pflegedokumentation und Investitionen in Ausbildungskapazitäten. Pflege ist kein Resthaushaltsposten.',
      },
      {
        heading: 'Prävention stärken',
        body: 'Das Gesundheitssystem ist primär auf die Behandlung von Krankheiten ausgerichtet, nicht auf deren Verhinderung. Dabei sind viele der häufigsten und teuersten Erkrankungen – Herz-Kreislauf-Erkrankungen, Typ-2-Diabetes, psychische Erkrankungen – durch gezielte Prävention deutlich reduzierbar. Wir wollen Präventionsprogramme stärken, Gesundheitsbildung in Schulen verankern und die digitale Gesundheitsinfrastruktur ausbauen.',
      },
    ],
    demands: [
      'Medizinstudienplätze bis 2035 um 30 Prozent erhöhen',
      'Wartezeiten für Kassenpatienten auf maximal vier Wochen begrenzen',
      'Tarifliche Mindestlöhne in der Pflege gesetzlich verankern',
      'Dokumentationspflichten in der Pflege massiv reduzieren',
      'Einheitliche Vergütungsstrukturen für Kassen- und Privatpatienten schaffen',
    ],
    conclusion: 'Gesundheitsversorgung muss für jeden Bürger, unabhängig von Einkommen und Versicherungsart, verlässlich, hochwertig und erreichbar sein. Das ist kein Privileg – das ist Grundversorgung.',
  },
  {
    title: 'Migration & Integration',
    slug: 'migration',
    subtitle: 'Klare Regeln, faire Verfahren, konsequente Integration.',
    intro: 'Migration ist eine der komplexesten politischen Fragen unserer Zeit. Die Neue Mitte lehnt sowohl die Verharmlosung als auch die Instrumentalisierung dieses Themas ab. Wir wollen eine ehrliche Debatte: Deutschland braucht qualifizierte Zuwanderung, hat klare Kapazitäten und rechtliche Verpflichtungen – und muss konsequenter werden, wo Regeln nicht eingehalten werden.',
    sections: [
      {
        heading: 'Legale Arbeitsmigration ausbauen',
        body: 'Deutschland hat einen strukturellen Fachkräftemangel, der sich ohne Zuwanderung nicht lösen lässt. Gleichzeitig ist der Weg zur Arbeitserlaubnis für qualifizierte Menschen aus Nicht-EU-Ländern kompliziert, langsam und oft frustrierend. Anerkennungsverfahren für ausländische Berufsabschlüsse dauern zu lange, Visaverfahren sind unberechenbar. Die Neue Mitte will das Fachkräfteeinwanderungsgesetz konsequent umsetzen und vereinfachen: schnellere Anerkennungen, digitale Antragstellung, klare Fristen.',
      },
      {
        heading: 'Schutz für tatsächlich Verfolgte',
        body: 'Das Grundrecht auf Asyl ist ein Grundwert. Wer in Deutschland Schutz sucht, weil er in seinem Heimatland verfolgt wird oder in Lebensgefahr ist, hat ein Anrecht auf ein faires und schnelles Verfahren. Die Neue Mitte bekennt sich zu diesem Recht – und erkennt an, dass ein glaubwürdiges Asylsystem auch bedeutet, dass Entscheidungen konsequent umgesetzt werden. Wer kein Aufenthaltsrecht hat, muss das Land verlassen. Das ist keine Härte, sondern Voraussetzung dafür, dass das System funktioniert.',
      },
      {
        heading: 'Integration ernst nehmen',
        body: 'Integration ist keine Einbahnstraße, aber sie setzt strukturelle Voraussetzungen voraus: ausreichend Sprachkurse, anerkannte Qualifikationen, Zugang zum Arbeitsmarkt und klare gesellschaftliche Erwartungen. Die Neue Mitte will Integrationserfolg zum Maßstab machen: Wer sich integriert, Deutsch lernt, Steuern zahlt und unsere Grundwerte teilt, ist willkommen. Die deutsche Staatsbürgerschaft soll an nachweisbare Integration, Sprachkenntnisse und Bekenntnis zur Verfassung geknüpft sein.',
      },
      {
        heading: 'Irreguläre Migration reduzieren',
        body: 'Deutschland hat kein ausreichendes Instrumentarium, um irreguläre Migration wirksam zu begrenzen. Das überfordert Kommunen, belastet den sozialen Frieden und schadet dem Vertrauen in den Staat. Wir wollen Rückführungsabkommen mit Herkunftsländern ernsthaft verhandeln, die Anerkennung sicherer Herkunftsstaaten ausweiten und konsequenter vollziehen. Das ist keine ideologische Position – es ist eine Frage der staatlichen Handlungsfähigkeit.',
      },
    ],
    demands: [
      'Anerkennungsverfahren für ausländische Qualifikationen innerhalb von 90 Tagen',
      'Schnellere und digitalere Asylverfahren mit klaren Fristen',
      'Staatsbürgerschaft an nachgewiesene Integration koppeln',
      'Rückführungsabkommen mit wichtigsten Herkunftsländern verbindlich gestalten',
      'Kommunen bei Integrationsaufgaben stärker finanziell unterstützen',
    ],
    conclusion: 'Migration gut zu regeln bedeutet: Wer kommt, weiß woran er ist. Wer schutzbedürftig ist, bekommt Schutz. Wer arbeitet und sich integriert, ist willkommen. Und wer kein Aufenthaltsrecht hat, muss konsequent zurückgeführt werden.',
  },
  {
    title: 'Europa & Internationale Politik',
    slug: 'europa',
    subtitle: 'Ein starkes Europa aus starken Staaten.',
    intro: 'Europa ist ein historisches Friedensprojekt, das täglich seinen Wert beweist. Die Neue Mitte bekennt sich zu einem geeinten, handlungsfähigen Europa – aber auch zu einer ehrlichen Debatte über die Grenzen der Zentralisierung. Starke europäische Institutionen entstehen aus starken Mitgliedstaaten, nicht aus deren Schwächung.',
    sections: [
      {
        heading: 'Subsidiarität ernst nehmen',
        body: 'Das Subsidiaritätsprinzip – Entscheidungen sollen auf der kleinstmöglichen politischen Ebene getroffen werden – ist eines der Grundprinzipien der EU. In der Praxis wird es zunehmend ausgehöhlt. Die EU reguliert Dinge, die besser auf nationaler oder regionaler Ebene entschieden würden, und verschleppt gleichzeitig Entscheidungen, die europäischer Koordination bedürfen. Die Neue Mitte will den Subsidiaritätscheck stärken und klarer zwischen europäischen und nationalen Kompetenzen unterscheiden.',
      },
      {
        heading: 'Handlungsfähigkeit in Kernbereichen',
        body: 'Europa braucht eine gemeinsame Außen- und Sicherheitspolitik, um geopolitisch handlungsfähig zu sein. Die Neue Mitte unterstützt den Aufbau einer Europäischen Verteidigungsunion als Ergänzung zur NATO, eine koordinierte Asyl- und Grenzschutzpolitik und einen echten europäischen Energiemarkt. In diesen Bereichen ist mehr europäische Zusammenarbeit sinnvoll und nötig.',
      },
      {
        heading: 'Demokratische Legitimation stärken',
        body: 'Das Europäische Parlament muss gestärkt werden. Das Initiativrecht für Gesetzgebung muss auch dem Parlament und nicht nur der Kommission zustehen. Und die Bürgerinnen und Bürger müssen verstehen, was Europa tut und warum. Transparenz und Bürgerbeteiligung sind Voraussetzungen für die langfristige Akzeptanz des europäischen Projekts.',
      },
    ],
    demands: [
      'Subsidiaritätsprinzip durch stärkere parlamentarische Kontrolle schützen',
      'Europäische Verteidigungsunion als Ergänzung zur NATO aufbauen',
      'Europäisches Parlament mit Initiativrecht ausstatten',
      'Gemeinsame Asylpolitik mit fairer Lastenteilung durchsetzen',
      'Energieunion ausbauen für europäische Versorgungssicherheit',
    ],
    conclusion: 'Wir wollen ein Europa, das nach außen stark handelt und nach innen die Vielfalt seiner Mitglieder respektiert. Ein starkes Europa entsteht nicht durch die Schwächung seiner Mitgliedstaaten, sondern durch ihre echte Zusammenarbeit.',
  },
  {
    title: 'Energie & Klima',
    slug: 'energie',
    subtitle: 'Klimaschutz mit Vernunft, Technologie und Versorgungssicherheit.',
    intro: 'Die Erderwärmung ist eine der größten langfristigen Herausforderungen unserer Zeit. Die Neue Mitte nimmt das ernst – und glaubt deshalb, dass Klimaschutz zu wichtig ist, um ihn schlecht zu machen. Ideologische Verbote, überstürzte Abschaltungen und realitätsferne Pläne gefährden die Versorgungssicherheit und schaden der Akzeptanz für notwendige Maßnahmen.',
    sections: [
      {
        heading: 'Technologieoffenheit statt Verbotspolitik',
        body: 'Die Energiewende wird gelingen, wenn wir alle ernsthaften Optionen in Betracht ziehen – und scheitern, wenn wir uns vor dem Lösungsraum verschließen. Die Neue Mitte unterstützt den massiven Ausbau erneuerbarer Energien: Solar, Wind, Geothermie. Gleichzeitig lehnen wir es ab, moderne Kerntechnologie kategorisch auszuschließen. Wer Klimaschutz und Versorgungssicherheit gleichzeitig erreichen will, muss pragmatisch sein.',
      },
      {
        heading: 'Kohleausstieg ja – aber geordnet',
        body: 'Deutschland hat den Kohleausstieg beschlossen. Die Neue Mitte unterstützt dieses Ziel – aber das Wie entscheidet über Erfolg oder Misserfolg. Kohlekraftwerke dürfen erst dann abgeschaltet werden, wenn gleichwertiger Ersatz durch grundlastfähige Kapazitäten vorhanden ist. Ein Abschalten ohne Ersatz gefährdet die Versorgungssicherheit und treibt Preise, die Haushalte und Unternehmen belasten.',
      },
      {
        heading: 'Bezahlbare Energie als sozialpolitisches Thema',
        body: 'Hohe Energiekosten sind keine abstrakte wirtschaftliche Größe – sie belasten konkret Familien mit mittleren und niedrigen Einkommen, gefährden Arbeitsplätze in energieintensiven Branchen und treiben Unternehmen ins Ausland. Klimaschutz, der die ärmeren Bevölkerungsschichten am stärksten belastet, ist kein Klimaschutz, der politisch und gesellschaftlich Bestand haben wird.',
      },
      {
        heading: 'CO₂-Bepreisung statt Verboten',
        body: 'Das ökonomisch effizienteste Instrument zum Klimaschutz ist eine faire CO₂-Bepreisung, die tatsächliche Emissionskosten widerspiegelt – kombiniert mit einer Rückverteilung der Einnahmen an die Bürgerinnen und Bürger. Die Neue Mitte unterstützt diesen Ansatz. Verbote, die nur dort wirken, wo sie ohnehin akzeptiert werden, sind teurer und weniger wirkungsvoll.',
      },
    ],
    demands: [
      'Massiver Ausbau der Erneuerbaren bei gleichzeitiger Versorgungssicherheit',
      'Kohleausstieg erst nach gesichertem Ersatz durch grundlastfähige Kapazitäten',
      'Prüfung moderner Kernenergie als Brückentechnologie',
      'CO₂-Bepreisung ausbauen und Einnahmen an Bürger zurückverteilen',
      'Netzausbau und Speichertechnologien massiv beschleunigen',
    ],
    conclusion: 'Klimaschutz und Wirtschaftsstandort sind kein Widerspruch – wenn man es richtig macht. Deutschland kann Vorbild sein, wenn es zeigt, dass Dekarbonisierung mit Vernunft, Technologie und echten Lösungen gelingt.',
  },
  {
    title: 'Innere Sicherheit & Rechtsstaat',
    slug: 'sicherheit',
    subtitle: 'Ein Staat, der seine Bürger schützt und Recht durchsetzt.',
    intro: 'Sicherheit ist ein Grundbedürfnis und eine Kernaufgabe des Staates. Deutschland hat in den vergangenen Jahren an Sicherheit verloren: nicht dramatisch, aber spürbar. Überlastete Gerichte, zu wenig Polizei, Straftaten ohne erkennbare Konsequenzen, digitale Kriminalität ohne adäquate Strafverfolgung. Das untergräbt das Vertrauen der Bevölkerung in den Staat.',
    sections: [
      {
        heading: 'Polizei modernisieren und stärken',
        body: 'Polizistinnen und Polizisten leisten täglich einen unverzichtbaren Dienst, oft unter schwierigen Bedingungen und mit veralteter Ausrüstung. Wir wollen in moderne Ausrüstung, Bodycams, digitale Einsatzsysteme und bessere Besoldung investieren. Gleichzeitig soll die Polizeiausbildung stärker auf Deeskalation, interkulturelle Kompetenz und digitale Strafverfolgung ausgerichtet werden.',
      },
      {
        heading: 'Konsequente Strafverfolgung',
        body: 'Gesetze, die nicht durchgesetzt werden, verlieren ihre Wirkung. Wenn Anzeigen versanden, Verfahren eingestellt werden oder Urteile deutlich unter dem gesetzlichen Rahmen bleiben, schwindet das Vertrauen in den Rechtsstaat. Die Neue Mitte fordert mehr Ressourcen für Staatsanwaltschaften, eine konsequentere Verfolgung von Wiederholungstätern und härtere Strafen bei schwerer körperlicher Gewalt.',
      },
      {
        heading: 'Digitale Kriminalität bekämpfen',
        body: 'Cyberkriminalität, Betrug im Internet, digitale Gewalt gegen Frauen und Hate Speech gegen politische Akteure nehmen massiv zu, während die Strafverfolgungsbehörden strukturell hinterherhinken. Wir wollen spezialisierte Cybercrime-Einheiten in jedem Bundesland, eine verbesserte internationale Zusammenarbeit und klare gesetzliche Grundlagen für die Strafverfolgung im digitalen Raum.',
      },
      {
        heading: 'Prävention als Teil der Sicherheitspolitik',
        body: 'Sicherheit entsteht nicht nur durch Repression. Soziale Programme, die Jugendkriminalität verhindern, Interventionsangebote, die Radikalisierung früh erkennen, und Stadtplanung, die sichere öffentliche Räume schafft, sind genauso wichtig wie mehr Polizei. Die Neue Mitte versteht Sicherheitspolitik als integriertes Konzept.',
      },
    ],
    demands: [
      'Bundesweite Einführung von Bodycams für alle Polizeikräfte',
      'Mehr Planstellen für Staatsanwaltschaften und Gerichte',
      'Spezialisierte Cybercrime-Einheiten in jedem Bundesland',
      'Härtere Strafen bei schwerer körperlicher und organisierter Gewalt',
      'Präventionsprogramme für Jugendliche in sozialen Brennpunkten',
    ],
    conclusion: 'Innere Sicherheit ist keine konservative Sonderinteresse – sie ist die Grundlage für gesellschaftliche Teilhabe, wirtschaftliche Aktivität und demokratische Kultur. Ein Staat, der Recht nicht durchsetzt, verliert seine Legitimität.',
  },
  {
    title: 'Digitalisierung & Verwaltung',
    slug: 'digitalisierung',
    subtitle: 'Ein Staat, der das 21. Jahrhundert erreicht hat.',
    intro: 'Deutschland ist bei der Digitalisierung der öffentlichen Verwaltung internationaler Schlusslicht. Bürgerinnen und Bürger müssen Formulare ausdrucken, persönlich bei Behörden erscheinen und Wartezeiten von Wochen in Kauf nehmen – für Vorgänge, die digital in Minuten erledigt werden könnten. Das ist keine Kleinigkeit: Es ist ein Signal dafür, wie ernst der Staat seine eigene Effizienz nimmt.',
    sections: [
      {
        heading: 'Warum Deutschland hinterherhinkt',
        body: 'Die Gründe für das digitale Versagen des deutschen Staates sind vielfältig: zersplitterte IT-Infrastruktur, Datenschutz als Ausrede statt als Rahmen, politische Prioritäten, die den echten Umbau immer wieder verschieben, und ein föderales System, das nationale Lösungen erschwert. Das Onlinezugangsgesetz hat hohe Erwartungen geweckt und zu bescheidene Ergebnisse geliefert. Das muss sich ändern.',
      },
      {
        heading: 'Digitale Verwaltung als Bürgerrecht',
        body: 'Kein Bürger soll für etwas, das digital erledigt werden kann, persönlich eine Behörde aufsuchen müssen. Wir wollen alle Verwaltungsdienstleistungen vollständig digitalisieren – von der Ummeldung über die Kfz-Zulassung bis hin zu Baugenehmigungen. Dabei soll die digitale Lösung der Standard sein, nicht die Ausnahme. Wer keinen digitalen Zugang hat, bekommt persönliche Unterstützung.',
      },
      {
        heading: 'Regulierung großer Plattformen',
        body: 'Wenige US-amerikanische Technologiekonzerne kontrollieren die digitale Öffentlichkeit. Das hat direkte Auswirkungen auf demokratische Diskurse, auf die Verbreitung von Desinformation und auf die wirtschaftliche Souveränität Europas. Die Neue Mitte unterstützt den Digital Markets Act und den Digital Services Act der EU und fordert eine konsequente Durchsetzung. Gleichzeitig wollen wir den Aufbau europäischer digitaler Infrastruktur fördern.',
      },
      {
        heading: 'Digitale Infrastruktur für alle',
        body: 'Flächendeckendes Glasfasernetz und 5G-Versorgung auch auf dem Land sind Voraussetzung für Chancengleichheit im digitalen Zeitalter. Wer in einer strukturschwachen Region lebt, darf nicht abgehängt sein. Wir wollen den Glasfaserausbau beschleunigen und digitale Infrastruktur als Daseinsvorsorge begreifen.',
      },
    ],
    demands: [
      'Alle Verwaltungsleistungen bis 2027 vollständig digital verfügbar',
      'Gesetzliche Bearbeitungsfristen für digitale Behördenanträge',
      'Konsequente Durchsetzung europäischer Plattformregulierung',
      'Glasfaserausbau flächendeckend bis 2030',
      'Zentrale digitale Bürgeridentität einführen',
    ],
    conclusion: 'Digitalisierung ist kein Selbstzweck. Sie ist das Mittel dafür, dass der Staat seinen Bürgern schneller, günstiger und besser dient. Das ist der Maßstab.',
  },
  {
    title: 'Wohnen & Stadtentwicklung',
    slug: 'wohnen',
    subtitle: 'Mehr Wohnraum, faire Mieten, Eigentum für die Mittelschicht.',
    intro: 'Die Wohnungsnot in deutschen Städten ist eine der drängendsten sozialen Fragen. Zu wenig gebaut, zu viel reguliert, zu langsam genehmigt – und eine Eigentumsquote, die im europäischen Vergleich erschreckend niedrig ist. Wohnen ist Daseinsvorsorge, und die Politik hat hier zu lange zu wenig getan.',
    sections: [
      {
        heading: 'Bauen als Lösung',
        body: 'Der Wohnungsmangel hat eine einfache Ursache: Es wurde zu wenig gebaut. Politische Debatten über Mietpreisbremsen, Milieuschutzsatzungen und Umwandlungsverbote adressieren Symptome, nicht die Ursache. Die Neue Mitte will die Ursache bekämpfen: Baugenehmigungen müssen schneller werden, Bauvorschriften weniger komplex, und kommunale Baupolitik muss Wachstum wieder ermöglichen.',
      },
      {
        heading: 'Wohneigentum fördern',
        body: 'Weniger als 50 Prozent der Deutschen wohnen in den eigenen vier Wänden – der niedrigste Anteil in der EU. Wohneigentum ist der wichtigste private Vermögensaufbau für die Mittelschicht, Altersvorsorge und gesellschaftliche Stabilisierung in einem. Wir wollen die Grunderwerbsteuer für den Erwerb der ersten selbst genutzten Immobilie deutlich senken, Baukindergeld reformieren und Eigenkapitalanforderungen für Erstkäufer attraktiver gestalten.',
      },
      {
        heading: 'Bürokratie beim Bauen reduzieren',
        body: 'Baugenehmigungsverfahren dauern in Deutschland durchschnittlich über ein Jahr. Das verteuert Bauprojekte, bremst Investitionen und schreckt Kleinbauherren ab. Wir wollen die Bauordnungen der Länder harmonisieren, digitale Genehmigungsverfahren einführen und gesetzliche Fristen mit Genehmigungsfiktion versehen.',
      },
    ],
    demands: [
      'Baugenehmigungen innerhalb von drei Monaten',
      'Grunderwerbsteuer für Erstkäufer selbst genutzter Immobilien auf 2 % senken',
      'Bundesweit vereinfachte Bauordnung für Standardgebäude',
      'Sozialwohnungsbau durch Steuererleichterungen für private Investoren fördern',
    ],
    conclusion: 'Wer ein sicheres Zuhause hat, kann besser am gesellschaftlichen Leben teilhaben. Wohnen ist kein Privileg – und Eigenverantwortung beim Eigentumserwerb ist etwas, das der Staat unterstützen, nicht durch Steuern bestrafen sollte.',
  },
  {
    title: 'Familie & Gesellschaft',
    slug: 'familie',
    subtitle: 'Familien stärken, Kindern Chancen geben.',
    intro: 'Familie ist die grundlegendste soziale Einheit unserer Gesellschaft. Die Neue Mitte versteht Familie breit: alle Menschen, die füreinander Verantwortung übernehmen. Familienpolitik muss Wahlfreiheit ermöglichen, nicht vorschreiben, wie das Familienleben auszusehen hat.',
    sections: [
      {
        heading: 'Kinderbetreuung ausbauen',
        body: 'Deutschland hat einen massiven Mangel an Kitaplätzen, insbesondere für unter Dreijährige und Ganztagesplätzen für Schulkinder. Das behindert die Vereinbarkeit von Familie und Beruf und belastet vor allem Frauen, die strukturell häufiger Erwerbstätigkeit reduzieren. Wir wollen den Kitaausbau bundesweit priorisieren und ausreichend finanzieren – als Investition in Bildung, Gleichstellung und wirtschaftliche Produktivität.',
      },
      {
        heading: 'Elternzeit modernisieren',
        body: 'Das Elterngeld ist ein wichtiges Instrument, hat aber blinde Flecken: Es bevorzugt hohe Einkommen und erreicht Geringverdiener zu wenig. Wir wollen das Elterngeld reformieren: höherer Sockelbetrag, längerer Bezugszeitraum bei Aufteilung zwischen beiden Elternteilen, und mehr Flexibilität bei der zeitlichen Nutzung.',
      },
      {
        heading: 'Familien steuerlich entlasten',
        body: 'Familien tragen durch Kindererziehung und Pflege von Angehörigen eine gesellschaftliche Leistung, die steuerlich nicht ausreichend anerkannt wird. Wir wollen Familien mit Kindern durch höhere Kinderfreibeträge und gezielte Entlastungen stärken – ohne den Fehler zu begehen, Kinderlosigkeit steuerlich zu bestrafen.',
      },
    ],
    demands: [
      'Rechtsanspruch auf Kitaplatz ab dem ersten Lebensjahr vollständig erfüllen',
      'Elterngeld reformieren: höherer Sockelbetrag und mehr Flexibilität',
      'Kinderfreibeträge erhöhen und Familien steuerlich entlasten',
      'Ganztagesbetreuung in Schulen flächendeckend ausbauen',
    ],
    conclusion: 'Wer Kinder bekommt, trägt zum gesellschaftlichen Zusammenhalt und zur Zukunftsfähigkeit Deutschlands bei. Das verdient Unterstützung – pragmatisch und ohne ideologische Scheuklappen.',
  },
  {
    title: 'Rente & Altersvorsorge',
    slug: 'rente',
    subtitle: 'Verlässliche Altersvorsorge ohne Generationenkonflikt.',
    intro: 'Das Rentensystem in seiner heutigen Form ist auf Dauer nicht aufrechtzuerhalten. Die demografische Entwicklung, sinkende Beitragszahlerzahlen und steigende Rentenbezieher erzeugen einen strukturellen Druck, den wir ehrlich adressieren müssen – statt ihn durch kurzfristige Wahlgeschenke zu verschleiern.',
    sections: [
      {
        heading: 'Demografischer Realismus',
        body: 'Deutschland altert schnell. Das Verhältnis von Beitragszahlern zu Rentenempfängern wird sich in den kommenden Jahrzehnten deutlich verschlechtern. Jede ehrliche Rentenpolitik muss das anerkennen. Das bedeutet nicht, dass Menschen im Alter auf Würde verzichten sollen – aber es bedeutet, dass wir über Eintrittsalter, Beitragsgestaltung und die Rolle privater Vorsorge ehrlich reden müssen.',
      },
      {
        heading: 'Renteneintritt bei 67 halten',
        body: 'Die Neue Mitte spricht sich gegen eine Absenkung des regulären Renteneintrittsalters aus. Angesichts der demografischen Lage wäre das eine Politik auf Kosten jüngerer Generationen. Gleichzeitig unterstützen wir flexible Übergänge: Wer gesundheitlich nicht kann, darf nicht bestraft werden. Und wer länger arbeiten will, soll dafür belohnt werden.',
      },
      {
        heading: 'Private Vorsorge stärken',
        body: 'Die staatliche Rente wird künftig allein nicht ausreichen. Wir wollen private Altersvorsorge attraktiver machen, Bürgerkonten nach skandinavischem Vorbild ermöglichen und die Riester-Reform in ein einfacheres und effektiveres System überführen. Altersvorsorge muss selbstverständlich sein – für alle, nicht nur für Besserverdienende.',
      },
    ],
    demands: [
      'Renteneintritt bei 67 halten, flexible Übergänge stärken',
      'Bürgerrente als einfaches kapitalgedecktes Vorsorgesystem einführen',
      'Riester-Reform durch transparentes und kostengünstiges Vorsorgesystem ersetzen',
      'Rente erst nach 45 Beitragsjahren ohne Abschläge',
    ],
    conclusion: 'Rentenpolitik ist Generationenpolitik. Die Neue Mitte will ein System, das für heutige Rentner verlässlich ist und für die nächste Generation finanzierbar bleibt.',
  },
  {
    title: 'Landwirtschaft & Ernährung',
    slug: 'landwirtschaft',
    subtitle: 'Heimische Landwirtschaft stärken, Bürokratie abbauen.',
    intro: 'Deutsche Landwirtinnen und Landwirte stehen unter massivem Druck: steigende Produktionskosten, internationale Konkurrenz, wachsende Regulierung und ein Preisdruck im Einzelhandel, der Investitionen kaum möglich macht. Die Neue Mitte steht auf der Seite derer, die Lebensmittel produzieren.',
    sections: [
      {
        heading: 'Bürokratie in der Landwirtschaft abbauen',
        body: 'Landwirte verbringen einen wachsenden Teil ihrer Arbeitszeit mit Dokumentation, Antragsstellung und Nachweispflichten, die den tatsächlichen Ertrag senken. Das EU-Agrarrecht ist hochkomplex, und nationale Überimplementierungen verschärfen das Problem noch. Wir wollen EU-Vorgaben ohne goldene Zügel umsetzen und Förderanträge digitalisieren und vereinfachen.',
      },
      {
        heading: 'Faire Wettbewerbsbedingungen',
        body: 'Wenn deutsche Landwirte nach deutschen Umweltstandards produzieren, aber mit importierten Produkten konkurrieren müssen, die unter deutlich niedrigeren Standards hergestellt wurden, ist das kein fairer Wettbewerb. Die Neue Mitte fordert, dass Handelsabkommen der EU Sozial- und Umweltstandards als verbindliche Anforderungen einschließen.',
      },
      {
        heading: 'Generationenwechsel ermöglichen',
        body: 'Viele landwirtschaftliche Betriebe finden keine Nachfolger. Junge Menschen, die Landwirtschaft betreiben wollen, scheitern an Kapitalanforderungen und bürokratischen Hürden. Wir wollen Einstiegsprogramme für junge Landwirte, Förderkredite und eine Beratungsinfrastruktur, die Übernahmen und Neugründungen ermöglicht.',
      },
    ],
    demands: [
      'Bürokratieabbau in der Landwirtschaft: EU-Vorgaben ohne goldene Zügel',
      'Faire Handelsabkommen mit gleichwertigen Standards für Importe',
      'Förderprogramme für Betriebsübergaben und Junglandwirte',
      'Digitalisierung der Förderantragsstellung',
    ],
    conclusion: 'Wer Lebensmittel produziert, leistet einen Grundbeitrag für das Gemeinwesen. Diese Arbeit verdient Respekt, faire Bedingungen und eine Politik, die zuhört.',
  },
  {
    title: 'Außenpolitik & Bundeswehr',
    slug: 'aussenpolitik',
    subtitle: 'Deutschland trägt internationale Verantwortung – und muss dafür gerüstet sein.',
    intro: 'Deutschland ist keine Insel. Als größte Volkswirtschaft Europas hat Deutschland eine besondere Verantwortung für Stabilität auf dem Kontinent, für das Funktionieren multilateraler Institutionen und für eine regelbasierte internationale Ordnung. Diese Verantwortung erfordert Investitionen in Sicherheit, glaubwürdige Diplomatie und strategische Autonomie.',
    sections: [
      {
        heading: 'NATO und transatlantische Partnerschaft',
        body: 'Die NATO ist das Fundament europäischer Sicherheit. Die Neue Mitte bekennt sich zur Mitgliedschaft und zum 2-Prozent-Ziel. Das bedeutet: Deutschland muss sein Verteidigungsbudget verlässlich auf zwei Prozent des BIP anheben – nicht als einmaliger Kraftakt, sondern als dauerhafte politische Verpflichtung. Die Bundeswehr braucht ausreichend Material, moderne Ausrüstung und gut ausgebildetes Personal.',
      },
      {
        heading: 'Bundeswehr reformieren',
        body: 'Die Bundeswehr leidet unter jahrzehntelanger Unterfinanzierung, Beschaffungsskandalen und strukturellen Problemen. Mehr Geld allein reicht nicht – es braucht eine grundlegende Reform der Beschaffung, klarere Führungsstrukturen und einen gesellschaftlichen Konsens darüber, dass eine einsatzfähige Armee ein Teil staatlicher Kernaufgaben ist.',
      },
      {
        heading: 'Abhängigkeiten reduzieren',
        body: 'Die Abhängigkeit von russischem Gas hat Deutschland in der Energiepolitik erpressbar gemacht. Die Lehre daraus ist: Strategische Abhängigkeiten müssen systematisch reduziert werden – auch beim Rohstoffimport aus China, bei kritischer digitaler Infrastruktur und bei Lieferketten für systemrelevante Güter. Das ist keine Abkoppelung, sondern strategische Vernunft.',
      },
      {
        heading: 'Entwicklungspolitik mit Wirkungsorientierung',
        body: 'Deutschland gibt Milliarden für Entwicklungszusammenarbeit aus – mit unklaren Wirkungsnachweisen. Die Neue Mitte will keine pauschale Kürzung, aber eine grundlegende Neuausrichtung: Messbare Wirkung, Transparenz über Mitteleinsatz und eine Konzentration auf wenige Schwerpunkte, die tatsächlich nachhaltige Wirkung entfalten.',
      },
    ],
    demands: [
      'NATO-Ziel von 2 % des BIP dauerhaft einhalten',
      'Bundeswehr-Beschaffung grundlegend reformieren',
      'Strategische Abhängigkeiten von autoritären Regimen systematisch reduzieren',
      'Entwicklungspolitik nach messbarer Wirkung ausrichten',
      'Europäische Verteidigungsfähigkeit stärken',
    ],
    conclusion: 'Deutschland kann nur dann international Verantwortung tragen, wenn es intern stabil, wirtschaftlich stark und militärisch bündnisfähig ist. Das ist die Grundlage jeder glaubwürdigen Außenpolitik.',
  },
]

export function getProgramArea(slug: string): ProgramArea | undefined {
  return PROGRAM_AREAS.find((a) => a.slug === slug)
}
