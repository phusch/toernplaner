# Törnplaner / Chillout Pirates Kalkulation – V1.4.2 Giftmann-Logik-Fix

Diese Version basiert auf **Toernplaner_V1.4.1_giftmann_display_fix** und korrigiert gezielt die Giftmann-Logik und die Anzeigen. Sie ist eine kleine, nachvollziehbare Korrektur auf Basis der freigegebenen V1.4-Logik.

Nicht geändert wurden:

```text
Supabase-Grundlogik
Cloud-Speichern / Cloud-Laden
Törnnamen
Save Guard / Ungespeichert-Warnung
Kostenbereiche Fixkosten / Mannschaftskasse / Sonstige
Rollen Nur Fixkosten / Nur Sonstige / Schenker
Kautions-Sonderlogik
```

---

## Zentrale Änderung in V1.4.2

Die Giftmann-Häkchen bedeuten jetzt eindeutig:

```text
angekreuzt     = dieser Bereich wird geschenkt / Giftmann zahlt ihn nicht selbst
nicht angekreuzt = diesen Bereich zahlt Giftmann selbst
```

Die sichtbaren Häkchen heißen deshalb:

```text
[ ] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Der Giftmann verursacht weiterhin als mitreisende Person Kosten in allen Bereichen. Die Häkchen entscheiden nur, **wer diese Kosten zahlt**.

---

## Rollen

Sichtbar in der App heißen die normalen zahlenden Mitfahrer jetzt:

```text
Mitreisende
```

Intern kann die Rolle aus Kompatibilitätsgründen weiterhin als `Vollzahler` gespeichert sein. In der Bedienung und in den Ausgaben erscheint aber „Mitreisende“.

Direkt bei jedem Teilnehmer auswählbar:

```text
Mitreisende
Nur Fixkosten
Nur Sonstige
Giftmann
Schenker
```

### Mitreisende

Zahlen:

```text
Fixkosten
Mannschaftskasse
Sonstige
Kaution wie bisher
offenen Giftmann-Rest, falls Geschenke nicht reichen
```

### Nur Fixkosten

Zahlen nur:

```text
Fixkosten
```

Zahlen nicht:

```text
Mannschaftskasse
Sonstige
Giftmann-Rest
```

### Nur Sonstige

Zahlen nur:

```text
Sonstige
```

Zahlen ausdrücklich nicht:

```text
Fixkosten
Mannschaftskasse
Giftmann-Rest
```

### Giftmann

Der Giftmann reist mit und verursacht grundsätzlich Kosten in allen drei Bereichen:

```text
Fixkosten
Mannschaftskasse
Sonstige
```

Nicht geschenkte Bereiche zahlt er selbst. Geschenkte Bereiche werden durch Schenkerbeträge und gegebenenfalls durch die Mitreisenden getragen.

### Schenker

Zahlt nur:

```text
Geschenkbeitrag
```

Reist nicht mit und nimmt nicht an Fixkosten, Mannschaftskasse oder Sonstige teil.

---

## Kostenbereiche

Bei Kostenpositionen gibt es nur noch drei auswählbare Bereiche:

```text
Fixkosten
Mannschaftskasse
Sonstige
```

Es gibt keine automatische Namenserkennung. Die App ordnet also Begriffe wie Charter, Schiff, Diesel, Hafen, Essen oder Taxi nicht automatisch zu. Der Bereich wird pro Kostenposition bewusst ausgewählt.

---

## Giftmann-Fälle

### Fall 1: Nur Fixkosten geschenkt

```text
[x] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Mannschaftskasse
Sonstige
```

Geschenkt wird:

```text
Fixkosten
```

Reichen die Schenkerbeträge nicht, geht der offene Rest nur auf die Mitreisenden.

### Fall 2: Nur Mannschaftskasse geschenkt

```text
[ ] Fixkosten geschenkt
[x] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Fixkosten
Sonstige
```

Geschenkt wird:

```text
Mannschaftskasse
```

### Fall 3: Nur Sonstige geschenkt

```text
[ ] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[x] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Fixkosten
Mannschaftskasse
```

Geschenkt wird:

```text
Sonstige
```

### Fall 4: Fixkosten + Mannschaftskasse geschenkt

```text
[x] Fixkosten geschenkt
[x] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Sonstige
```

### Fall 5: Fixkosten + Sonstige geschenkt

```text
[x] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[x] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Mannschaftskasse
```

### Fall 6: Mannschaftskasse + Sonstige geschenkt

```text
[ ] Fixkosten geschenkt
[x] Mannschaftskasse geschenkt
[x] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
Fixkosten
```

### Fall 7: Alles geschenkt

```text
[x] Fixkosten geschenkt
[x] Mannschaftskasse geschenkt
[x] Sonstige geschenkt
```

Giftmann zahlt selbst:

```text
0,00 €
```

Wenn die Schenkerbeträge nicht reichen, wird der offene Rest nur auf die Mitreisenden verteilt.

### Fall 8: Nichts geschenkt

```text
[ ] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Giftmann wird wie ein normaler Mitreisender berechnet.

Er zahlt dann selbst:

```text
Fixkosten
Mannschaftskasse
Sonstige
```

Der Schenkergesamtbetrag reduziert in diesem Fall die Kosten aller Mitreisenden inklusive Giftmann.

---

## Mehrere Giftmänner

Diese Version ist bewusst für genau **einen Giftmann** ausgelegt.

```text
Mehrere Giftmänner sind nicht vorgesehen.
```

Falls versehentlich mehrere Personen als Giftmann markiert werden, ist das kein unterstützter Anwendungsfall. Für die praktische Nutzung bitte nur eine Person als Giftmann auswählen.

---

## Übersicht / Ergebnisse

Die Übersichtsseite zeigt bei den Ergebnissen jetzt:

```text
Giftmann zahlt selbst
```

Das ist der tatsächlich vom Giftmann zu zahlende Betrag ohne Kaution. Es ist nicht mehr nur der rechnerische Gesamtanteil.

Zusätzlich zeigt die Kontrolle:

```text
Giftmann rechnerischer Anteil
Davon geschenkte Bereiche
Offener Giftmann-Rest auf Mitreisende
Kontrollabweichung ohne Kaution
Differenz Kaution
```

---

## Einzelbeträge

Im Reiter Einzelbeträge wird bei Giftmann sichtbar:

```text
rechnerischer Anteil
selbst zu zahlen
geschenkt
Fixkosten selbst
Mannschaftskasse selbst
Sonstige selbst
```

Die Hauptzahlungsspalten zeigen den tatsächlich zu zahlenden Betrag.

---

## Teilnehmerverwaltung

Die Teilnehmerverwaltung zeigt weiterhin die endgültig zahlbaren Beträge.

Bei Giftmann werden jetzt nur die tatsächlich selbst zu zahlenden Bereiche als Zahlungsanforderung aufgeführt:

```text
Fixkosten selbst zu zahlen
Mannschaftskasse selbst zu zahlen
Sonstige selbst zu zahlen
```

Wenn alles geschenkt ist, erscheint:

```text
Geschenkt / keine Anforderung = 0,00 €
```

---

## Kaution

Kaution bleibt wie bisher Sonderlogik. Sie ist keine normale Kostenposition und gehört nicht zu Fixkosten, Mannschaftskasse oder Sonstige.

In Fall 8, wenn beim Giftmann nichts geschenkt ist und er wie ein normaler Mitreisender berechnet wird, wird er auch wie ein Mitreisender behandelt.

---

## Empfohlenes Testprocedere

Vor produktiver Nutzung bitte testen:

```text
1. Standardfall öffnen
2. Giftmann-Häkchen alle sieben Geschenkfälle testen
3. Fall 8 testen: kein Häkchen aktiv
4. Prüfen: Übersicht zeigt „Giftmann zahlt selbst“
5. Prüfen: Einzelbeträge zeigen Giftmann selbst / geschenkt
6. Prüfen: Teilnehmerverwaltung zeigt nur zahlbare Giftmann-Bereiche
7. Prüfen: Nur Fixkosten zahlt keine Mannschaftskasse und keine Sonstige
8. Prüfen: Nur Sonstige zahlt keine Fixkosten und keine Mannschaftskasse
9. Prüfen: Kontrollabweichung ohne Kaution bleibt 0,00 € oder Rundungsdifferenz
10. Erst danach speichern oder in die Cloud übertragen
```

---

## Version

```text
V1.4.2 Giftmann-Logik-Fix
Basis: V1.4.1 Giftmann Display Fix
Änderung: Giftmann-Häkchen bedeuten geschenkte Bereiche; nicht geschenkte Bereiche zahlt Giftmann selbst.
```
