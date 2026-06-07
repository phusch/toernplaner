# Törnplaner / Chillout Pirates Kalkulation – V1.4 Endversion Rollenlogik

Diese Version basiert auf **V1.3 Trip Names** und der geprüften **V1.4.1-Korrektur**. Sie ist die freigegebene **Endversion V1.4** für die neue Rollen- und Kostenlogik.

Die Änderungen betreffen gezielt:

- Teilnehmerrollen
- Kostenbereiche
- Giftmann-Beteiligung
- Giftmann-Restverteilung
- Anzeige in Einzelbeträge und Teilnehmerverwaltung

Nicht Ziel dieser Version ist ein optischer Umbau. Supabase, Törnnamen, Save Guard und lokale Speicherung bleiben aus V1.3 erhalten.

**Freigabehinweis:** Diese V1.4-Endversion übernimmt die korrigierte Rollenlogik aus V1.4.1. Der von dir geprüfte Fall, bei dem die Rechnung wieder V1.3 entspricht und Giftmann bei der Mannschaftskasse als Kostenverursacher berücksichtigt wird, ist Grundlage dieser finalen Fassung.

---

## Wichtig

V1.4 ist die freigegebene Endversion der neuen Rollen- und Kostenlogik. Sie sollte trotzdem wie jede neue Version mit einem Backup betrieben werden, weil sie die bisherige Berechnungslogik erweitert.

---

## Neue Grundregel für Kostenpositionen

Bei Kostenpositionen gibt es nur noch drei auswählbare Bereiche:

```text
Fixkosten
Mannschaftskasse
Sonstige
```

Es gibt keine automatische Namenserkennung.

Das bedeutet:

```text
Charter, Schiff, Diesel, Hafengebühr, Essen, Taxi, Versicherung usw.
```

werden nicht automatisch zugeordnet. Du wählst den Bereich selbst pro Kostenposition.

---

## Migration alter Kostenpositionen

Beim Laden alter Daten werden Kostenbereiche so übernommen:

```text
alte Fixkosten Boot / Charterlogik → Fixkosten
alte Mannschaftskasse              → Mannschaftskasse
alles andere                       → Sonstige
```

Danach bietet die App nur noch die drei neuen Bereiche an.

---

## Neue Teilnehmerrollen

Direkt bei jedem Teilnehmer auswählbar:

```text
Vollzahler
Nur Fixkosten
Nur Sonstige
Giftmann
Schenker
```

### Vollzahler

Zahlt:

```text
Fixkosten
Mannschaftskasse
Sonstige
Kaution wie bisher
offenen Giftmann-Rest, falls Geschenke nicht reichen
```

### Nur Fixkosten

Zahlt nur:

```text
Fixkosten
```

Zahlt nicht:

```text
Mannschaftskasse
Sonstige
Giftmann-Rest
```

### Nur Sonstige

Zahlt nur:

```text
Sonstige
```

Zahlt ausdrücklich nicht:

```text
Fixkosten
Mannschaftskasse
Giftmann-Rest
```

### Giftmann

Giftmann ist eine Sonderrolle.

Grundregel:

```text
Giftmann zahlt 0,00 €
```

Bei Giftmann gibt es drei Häkchen:

```text
[ ] beteiligt sich rechnerisch an Fixkosten
[ ] beteiligt sich rechnerisch an Mannschaftskasse
[ ] beteiligt sich rechnerisch an Sonstige
```

Nur aktivierte Bereiche erzeugen einen rechnerischen Giftmann-Anteil.

### Schenker

Zahlt nur:

```text
Geschenkbeitrag
```

Reist nicht mit und nimmt nicht an Fixkosten, Mannschaftskasse oder Sonstige teil.

---

## Geschenklogik Giftmann

Geschenke decken den rechnerischen Gesamtbetrag des Giftmanns unabhängig vom Bereich.

Beispiel:

```text
Giftmann Fixkosten-Anteil:       400 €
Giftmann Mannschaftskasse:       200 €
Giftmann Sonstige:               100 €
Giftmann rechnerisch gesamt:     700 €
Geschenke gesamt:                500 €
Offener Giftmann-Rest:           200 €
```

Der offene Rest wird nur auf diese Rolle verteilt:

```text
Vollzahler
```

Nicht auf:

```text
Nur Fixkosten
Nur Sonstige
Giftmann
Schenker
```

---

## Kaution

Kaution bleibt als Sonderlogik erhalten.

In dieser V1.4-Endversion bleibt sie wie bisher bei den Vollzahlern in der ersten Überweisung. Sie wird nicht als normale Kostenposition behandelt und gehört nicht zu Fixkosten, Mannschaftskasse oder Sonstige.

---

## Teilnehmerverwaltung

Die Teilnehmerverwaltung zeigt jetzt je nach Rolle getrennte Zahlungsbereiche:

```text
Vollzahler:
- Fixkosten / Kaution
- Mannschaftskasse
- Sonstige

Nur Fixkosten:
- Fixkosten

Nur Sonstige:
- Sonstige

Giftmann:
- Giftmann entlastet / keine Anforderung = 0,00 €

Schenker:
- Geschenkbeitrag Giftmann
```

Damit bleibt sichtbar, warum eine Person welchen Betrag zahlen soll.

---

## Einzelbeträge

Der Reiter Einzelbeträge bleibt bewusst kompakt.

Die Rollen werden aber neu ausgewertet:

```text
Vollzahler       → Gesamtbetrag aus Fixkosten + Mannschaftskasse + Sonstige + ggf. Giftmann-Rest
Nur Fixkosten    → nur Fixkosten
Nur Sonstige     → nur Sonstige
Giftmann         → 0,00 €
Schenker         → Geschenkbeitrag
```

Die CSV enthält zusätzlich Spalten für:

```text
Fixkosten/Kaution
Mannschaftskasse
Sonstige
Geschenk
```

---

## Supabase / Cloud

Supabase bleibt wie in V1.3:

```text
manuell speichern
manuell laden
alle lokalen Törns in Cloud speichern
Cloud-Import als Kopie möglich
```

Wichtig: Nach einer Rollen- oder Kostenbereichsänderung bitte zuerst lokal speichern und danach Cloud speichern.

---

## Speicher-Procedere

Empfohlene Reihenfolge:

```text
1. Törn öffnen
2. Rollen und Kostenbereiche prüfen
3. Änderungen durchführen
4. Anzeige oben prüfen: Ungespeichert
5. Speichern klicken
6. Einzelbeträge kontrollieren
7. Teilnehmerverwaltung kontrollieren
8. optional: Aktiven Törn in Cloud speichern
9. optional: Backup exportieren
```

---

## Pflicht-Testfälle für V1.4

Bitte vor Freigabe als stabil testen:

### Test 1: Standardfall

```text
Vollzahler + Schenker + Giftmann
Giftmann-Häkchen Fixkosten und Mannschaftskasse aktiv
Geschenke reichen aus
```

Erwartung:

```text
Giftmann zahlt 0,00 €
Kontrollabweichung ohne Kaution ~ 0,00 €
Kautionsdifferenz ~ 0,00 €
```

### Test 2: Nur Fixkosten

Eine Person auf Rolle stellen:

```text
Nur Fixkosten
```

Erwartung:

```text
Person zahlt nur Fixkosten
keine Mannschaftskasse
keine Sonstige
kein Giftmann-Rest
```

### Test 3: Nur Sonstige

Eine Person auf Rolle stellen:

```text
Nur Sonstige
```

Erwartung:

```text
Person zahlt nur Sonstige
keine Fixkosten
keine Mannschaftskasse
kein Giftmann-Rest
```

### Test 4: Giftmann ohne Häkchen

Alle Giftmann-Häkchen ausschalten.

Erwartung:

```text
Giftmann rechnerischer Anteil = 0,00 €
Geschenke werden als Überschuss behandelt
Giftmann zahlt 0,00 €
```

### Test 5: Geschenke reichen nicht

Schenkerbetrag reduzieren.

Erwartung:

```text
offener Giftmann-Rest wird nur auf Vollzahler verteilt
Nur Fixkosten bleibt nur Fixkosten
Nur Sonstige bleibt nur Sonstige
Giftmann bleibt 0,00 €
```

---

## Geänderte Dateien

```text
index.html
README.md
sw.js
```

## Nicht geändert

```text
app.js
assets/
manifest.webmanifest
supabase_migration_001_initial_sync_schema.sql
```

Hinweis: Die laufende App steckt weiterhin in `index.html`. Die Datei `app.js` liegt im Paket, wird aber von der aktuellen HTML nicht als Hauptlogik geladen.



## V1.4 Endversion – Korrekturen aus der Arbeitsphase

Diese Endversion enthält die geprüften Korrekturen aus der V1.4.1-Arbeitsphase:

1. **Giftmann-Beteiligung bei alten oder teilweise gespeicherten Daten**  
   Fehlende Häkchen werden nicht mehr stillschweigend als `false` behandelt. Der V1.0/V1.3-Standard bleibt erhalten: Giftmann zählt rechnerisch zu Fixkosten und Mannschaftskasse, Sonstige bleibt zunächst aus, sofern nichts anderes gesetzt wurde. Dadurch wird Giftmann bei Mannschaftskasse-Kosten wieder als Person berücksichtigt, wenn das Mannschaftskasse-Häkchen aktiv ist.

2. **Teilnehmerverwaltung zeigt endgültigen Gesamtbetrag**  
   Je Teilnehmer wird zusätzlich eine Zeile „Endgültig zahlbar gesamt“ angezeigt. Dieser Betrag ist der zahlbare Betrag nach Giftmann-Entlastung, Schenkerbeträgen, Restverteilung auf Vollzahler und Kaution.

Nicht geändert wurden die drei Grundregeln: nur Kostenbereiche Fixkosten, Mannschaftskasse, Sonstige; Giftmann zahlt selbst 0 €; offener Giftmann-Rest wird nur auf Vollzahler verteilt.
