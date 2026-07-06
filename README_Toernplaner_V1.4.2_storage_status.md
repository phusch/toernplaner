# 🏴‍☠️ Törnplaner / Chillout Pirates Kalkulation

**Aktuelle Arbeitsversion:** `V1.4.2_storage_status`  
**Basis:** `Toernplaner_V1.4.2_giftmann_logic_fix.zip`  
**Stand:** 08.06.2026

Der Törnplaner ist eine mobile, offlinefähige Kosten- und Teilnehmerverwaltung für Segeltörns der **Chillout Pirates**. Die App berechnet Kostenanteile für Mitreisende, Sonderrollen, Schenkungen, Mannschaftskasse und Kaution. Zusätzlich können mehrere Törns lokal verwaltet und optional manuell mit Supabase in der Cloud gesichert werden.

Diese Version basiert auf der getesteten und freigegebenen **V1.4.2 Giftmann-Logik**. Die Rechenlogik wurde in den letzten Anzeigeänderungen **nicht verändert**.

---

## ✅ Was diese Version kann

- mehrere Törns lokal im Browser verwalten
- Teilnehmer mit Rollen pflegen
- Kostenpositionen den Bereichen **Fixkosten**, **Mannschaftskasse** und **Sonstige** zuordnen
- Kaution getrennt als Sonderlogik berechnen
- Giftmann-/Schenker-Logik nach V1.4.2 berechnen
- Übersichtsseite mit Rollen und Gesamtbetrag je Teilnehmer anzeigen
- Einzelbeträge detailliert ausgeben
- Teilnehmerverwaltung mit offenen Beträgen, Zahlungsstatus und Notizen führen
- CSV exportieren
- Backup als JSON exportieren und importieren
- aktuellen Stand als Link teilen
- optional manuell in Supabase speichern und aus Supabase laden
- klar unterscheiden zwischen **lokal gespeichert** und **Cloud gespeichert**

---

## 🆕 Aktueller Stand dieser Version

Gegenüber der ursprünglichen V1.4.2 wurden nur Anzeige- und Bedienklarheitsänderungen ergänzt:

### 1. Übersicht: Teilnehmer & Rollen & Gesamtbetrag

Auf der Übersichtsseite zeigt der Bereich Ergebnisse jetzt:

```text
Teilnehmer | Rolle | Gesamtbetrag
```

Die dritte Spalte zeigt den endgültigen Gesamtbetrag je Teilnehmer, also den Betrag, der tatsächlich zu zahlen ist:

```text
Gesamtbetrag = Geschenkbeitrag + Reisebetrag ohne Kaution + Kaution
```

Bei längeren Rollenhinweisen, besonders beim Giftmann, darf die Rollen-Spalte mehrzeilig umbrechen.

### 2. Eindeutige lokale Speicheranzeige

Beim normalen Speichern steht jetzt ausdrücklich:

```text
Lokal gespeichert: 08.06.2026, 16:42
```

Damit ist klar: Der Button **Speichern** sichert den Stand nur auf dem aktuellen Gerät und im aktuellen Browser.

### 3. Eindeutige Cloud-Speicheranzeige

Beim Cloud-Speichern steht jetzt ausdrücklich:

```text
Cloud gespeichert: 08.06.2026, 16:42 · Revision 5
```

Die Revision kommt aus Supabase und zeigt, dass der Cloud-Datensatz wirklich aktualisiert wurde.

### 4. Cloud-Liste mit Datum vor dem Törnnamen

Die Cloud-Liste zeigt das Datum jetzt zuerst:

```text
08.06.2026, 16:42 · Friesland 2027
```

Das ist auf iPhone/Safari besser lesbar, weil lange Törnnamen sonst das rechts stehende Datum abschneiden können.

---

## 🧭 Bedienung

### Reiter Törns

Hier werden mehrere Kalkulationen verwaltet.

Wichtige Funktionen:

- **Neuen Törn anlegen** erstellt eine neue lokale Kalkulation.
- **Backup importieren** lädt eine JSON-Sicherung.
- **Aktiven Törn in Cloud speichern** speichert den aktuell ausgewählten Törn in Supabase.
- **Alle lokalen Törns in Cloud speichern** speichert alle lokalen Törns in Supabase.
- **Cloud-Liste laden** lädt die vorhandenen Supabase-Törns in die Auswahlliste.
- **Ausgewählten Cloud-Törn übernehmen** überschreibt nach Bestätigung den lokalen Törn mit dem Cloud-Stand.
- **Als Kopie importieren** lädt den Cloud-Törn als neue lokale Kopie.

Wichtig:

```text
Speichern = lokal
Aktiven Törn in Cloud speichern = Supabase
Alle lokalen Törns in Cloud speichern = Supabase
```

Es gibt bewusst keinen automatischen Cloud-Sync. Dadurch werden lokale Daten nicht unbemerkt überschrieben.

---

## 👥 Rollenlogik

Folgende Rollen sind direkt bei jedem Teilnehmer auswählbar:

```text
Mitreisende
Nur Fixkosten
Nur Sonstige
Giftmann
Schenker
```

### Mitreisende

Mitreisende zahlen grundsätzlich:

- Fixkosten
- Mannschaftskasse
- Sonstige
- Kaution wie bisher
- offenen Giftmann-Rest, falls Schenkerbeträge nicht reichen

### Nur Fixkosten

Diese Rolle zahlt nur:

- Fixkosten

Sie zahlt nicht:

- Mannschaftskasse
- Sonstige
- Giftmann-Rest

### Nur Sonstige

Diese Rolle zahlt nur:

- Sonstige

Sie zahlt nicht:

- Fixkosten
- Mannschaftskasse
- Giftmann-Rest

### Schenker

Schenker reisen nicht mit und zahlen nur den Geschenkbeitrag.

Sie nehmen nicht teil an:

- Fixkosten
- Mannschaftskasse
- Sonstige
- Kaution

---

## 🎁 Giftmann-Logik V1.4.2

Die Giftmann-Logik ist der zentrale getestete Stand dieser Version.

Die Giftmann-Häkchen bedeuten:

```text
angekreuzt       = dieser Bereich wird geschenkt
nicht angekreuzt = diesen Bereich zahlt Giftmann selbst
```

Sichtbare Häkchen:

```text
[ ] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Der Giftmann reist mit und verursacht rechnerisch Kosten. Die Häkchen entscheiden nur, ob er diese Kosten selbst zahlt oder ob sie geschenkt werden.

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
0,00 € ohne Kaution
```

Falls Schenkerbeträge nicht reichen, wird der offene Rest nur auf Mitreisende verteilt.

### Fall 8: Nichts geschenkt

```text
[ ] Fixkosten geschenkt
[ ] Mannschaftskasse geschenkt
[ ] Sonstige geschenkt
```

Giftmann wird wie ein normaler Mitreisender berechnet.

Der Schenkergesamtbetrag reduziert in diesem Fall die Kosten aller Mitreisenden inklusive Giftmann.

---

## ⚙ Kostenbereiche

Kostenpositionen werden bewusst einem von drei Bereichen zugeordnet:

```text
Fixkosten
Mannschaftskasse
Sonstige
```

Es gibt keine automatische Namenserkennung. Begriffe wie Charter, Schiff, Diesel, Hafen, Essen oder Taxi werden nicht automatisch interpretiert. Die Zuordnung erfolgt bewusst über das Feld **Bereich**.

Berechnungsarten:

- **Pauschal**
- **Einmalig × Personen**
- **Zeitraum × Personen**

Die Mannschaftskasse bleibt als eigene Sonderlogik erhalten.

---

## 💰 Kaution

Die Kaution bleibt unverändert als Sonderlogik erhalten.

Sie wird getrennt von der Reiseberechnung behandelt und in den Teilnehmerbeträgen zusätzlich berücksichtigt.

---

## ☁️ Supabase Cloud-Speicher

Supabase ist optional und manuell.

### Was wird gespeichert?

Beim Cloud-Speichern werden zwei Ebenen gespeichert:

1. Kopfdaten in der Tabelle:

```text
trips
```

2. vollständiger Törnzustand als JSON in:

```text
trip_states.state_json
```

Darin steckt der komplette lokale Törnzustand:

- Törnname
- Zeitraum
- Teilnehmer
- Rollen
- Giftmann-Häkchen
- Kostenpositionen
- Bemerkungen
- Zahlungsdaten der Teilnehmerverwaltung

### Cloud-Speichern prüfen

Nach dem Klick auf **Aktiven Törn in Cloud speichern** sollte in der App stehen:

```text
Cloud gespeichert: 08.06.2026, 16:42 · Revision 5
```

Die Revision muss bei erneutem Speichern steigen.

### Prüfung direkt in Supabase

Im Supabase SQL Editor kann diese Abfrage verwendet werden:

```sql
select
  t.name,
  t.client_updated_at as app_zeit,
  t.updated_at as trip_updated,
  s.revision,
  s.updated_at as state_updated,
  s.client_updated_at as state_app_zeit,
  s.state_json ->> 'name' as json_toernname
from public.trips t
join public.trip_states s on s.trip_id = t.id
where t.deleted_at is null
order by s.updated_at desc;
```

Wenn nach dem Cloud-Speichern oben ein aktueller Eintrag erscheint und `revision` steigt, wurde der Törn wirklich in Supabase gespeichert.

Hinweis: Supabase zeigt Zeiten häufig in UTC. Deutschland liegt im Sommer bei UTC+2.

---

## 💾 Lokal speichern, Backup und Teilen

### Lokal speichern

Der Button **Speichern** sichert den aktuellen Stand im Browser auf dem Gerät.

Die App zeigt danach:

```text
Lokal gespeichert: Datum, Uhrzeit
```

### Backup

Der Button **Backup** exportiert alle lokalen Törns als JSON-Datei.

Diese Datei ist die sicherste geräteunabhängige Sicherung, unabhängig von Browsercache oder Supabase.

### Backup importieren

Ein zuvor exportiertes Backup kann wieder importiert werden.

Vor dem Import greift der Save Guard, wenn lokale Änderungen ungespeichert sind.

### Teilen

Der Button **Teilen** erzeugt einen Link mit dem aktuellen Stand.

Wichtig: Ein geteiltes Projekt ist nicht automatisch dauerhaft gespeichert. Nach dem Öffnen eines geteilten Stands sollte auf dem Zielgerät **Speichern** gedrückt werden.

---

## 🛡 Save Guard

Die App warnt vor Aktionen, die ungespeicherte lokale Änderungen überschreiben könnten.

Das betrifft insbesondere:

- Cloud-Törn übernehmen
- Backup importieren
- Ursprungsdaten laden
- Törn wechseln oder überschreiben

Dadurch sollen versehentliche Datenverluste vermieden werden.

---

## 📱 Installation / Nutzung

Die App ist eine reine HTML-/JavaScript-App.

### Lokal testen

Datei öffnen:

```text
index.html
```

### Über GitHub Pages nutzen

Empfohlen für iPhone/iPad:

1. Repository auf GitHub anlegen.
2. Dateien aus dem ZIP hochladen.
3. GitHub Pages aktivieren.
4. Die veröffentlichte URL im Safari öffnen.
5. Bei Bedarf zum Home-Bildschirm hinzufügen.

Nach dem ersten Laden ist die App durch Service Worker und Manifest grundsätzlich offline nutzbar.

---

## 📦 Dateistruktur

```text
index.html                                      Haupt-App mit UI und aktiver Logik
sw.js                                           Service Worker / Cache
manifest.webmanifest                            PWA-Manifest
assets/logo.png                                 Logo
assets/icon-180.png                             iOS-Icon
assets/icon-192.png                             PWA-Icon
assets/icon-512.png                             PWA-Icon groß
supabase_migration_001_initial_sync_schema.sql  Supabase-Datenbankschema
SUPABASE_EINFACH_EINRICHTUNG_V1.1.md            Supabase-Einrichtungshilfe
README.md                                       Diese Dokumentation
app.js                                          historische/mitgelieferte Datei; aktive App-Logik steckt in index.html
*.diff                                          Änderungs-Patches / Entwicklungsnachweis
```

---

## 🧪 Empfohlener Funktionstest nach Upload

Nach dem Hochladen auf GitHub Pages oder nach dem Entpacken lokal:

1. App öffnen.
2. Einen Törn auswählen oder neu anlegen.
3. Teilnehmerrollen prüfen.
4. Giftmann-Häkchen setzen und Ergebnis prüfen.
5. In der Übersicht prüfen, ob die Spalte **Gesamtbetrag** sichtbar ist.
6. **Speichern** drücken und prüfen:

```text
Lokal gespeichert: Datum, Uhrzeit
```

7. Bei Supabase-Nutzung einloggen.
8. **Aktiven Törn in Cloud speichern** drücken und prüfen:

```text
Cloud gespeichert: Datum, Uhrzeit · Revision X
```

9. **Cloud-Liste laden** drücken und prüfen, ob Einträge so angezeigt werden:

```text
Datum, Uhrzeit · Törnname
```

10. Optional in Supabase prüfen, ob `trip_states.revision` gestiegen ist.

---

## 🔒 Sicherheits- und Datenschutzhinweise

- Niemals einen `service_role`-Key oder Secret-Key in der App eintragen.
- Nur den öffentlichen `publishable` oder `anon` Key verwenden.
- Supabase-Zugriff ist über Row Level Security auf den angemeldeten Nutzer beschränkt.
- Lokale Daten liegen im Browser-Speicher des Geräts.
- Browserdaten löschen kann lokale Törns entfernen. Deshalb regelmäßig Backup exportieren.

---

## 🚫 Bewusst nicht geändert

In dieser Version wurden nicht verändert:

- `calc()`-Berechnungslogik
- Rollenlogik
- Giftmann-Logik
- Kautionslogik
- Supabase-Datenmodell
- Cloud-Speichermechanik
- optische Grundgestaltung

Die letzten Änderungen betreffen nur:

- bessere Statusmeldungen für lokales Speichern
- bessere Statusmeldungen für Cloud-Speichern
- bessere Cloud-Listenanzeige
- Anzeige des Gesamtbetrags auf der Übersichtsseite
- Service-Worker-Cache-Name zur sauberen Aktualisierung

---

## 🧾 Kurzfassung

```text
Speichern                         = lokal auf diesem Gerät
Aktiven Törn in Cloud speichern   = Supabase
Cloud-Liste laden                 = Supabase-Törns anzeigen
Datum vor Törnname                = bessere Sichtbarkeit auf iPhone/Safari
Revision                          = Nachweis für echte Cloud-Aktualisierung
Giftmann-Häkchen                  = angekreuzter Bereich ist geschenkt
Nicht angekreuzter Bereich        = Giftmann zahlt selbst
```

---

## 🏁 Status

Diese Version ist eine kleine, nachvollziehbare Weiterentwicklung der getesteten V1.4.2.

Die Rechenlogik bleibt unverändert. Die App ist damit weiterhin die freigegebene V1.4.2-Basis mit verbesserter Übersicht und klarerer Speicheranzeige.
