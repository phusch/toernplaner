# Törnplaner V1.5.8 – aktuelle Daten sicher übernehmen

## Zweck
Die App basiert **nur** auf der vom Nutzer hochgeladenen `toernplaner.zip` und auf der daraus erstellten separaten V1.5.7-Speichertestversion. **Keine Änderungen an Kostenformeln, Giftmann-Logik, Teilnehmerverwaltung, Wise-Berechnung oder bisheriger Supabase-Cloud.**

**WICHTIG: Die aktuelle Sicherung enthält persönliche Kontaktangaben und konkrete Zahlungsdaten. Deshalb ist sie NICHT im öffentlichen GitHub-Pages-Paket enthalten!** Sie wird als separat herunterladbare **private** Sicherung ausgeliefert.

## Übernommene Originaldaten
- Basisdatei: `Bup vor Appspeicherumbau-chillout-pirates-toerns-backup.json` (unverändert und bytegleich).
- Enthält **2 Törns**, einschließlich aktivem Törn, Teilnehmern, Rollen, Zahlungsdaten, Kostenarten, Wise-Kontrolle, Bemerkungen, Datumsangaben, Cloud-Metadaten und allen weiteren Originalfeldern.
- Original-SHA256: `33a1c2993234d0e140796dc52a60f663e0f4bd77cd5b2ae7f334a07487c67b0e`
- **Kein automatisches Laden bei App-Start.** Eine ZIP-Datei im App-Repository ersetzt keine Browserdaten und keine private GitHub-Sicherung.

## Sicherer Einmalimport auf einem frischen Gerät
1. Das ÖFFENTLICHE V1.5.8-App-Paket separat unter einer Test-URL veröffentlichen. Niemals die private Sicherung ins öffentliche Repo laden.
2. App öffnen und auf den Speicherbutton klicken.
3. „JSON-Backup laden / Vorschau“ wählen und die **PRIVATE** JSON-Datei vom lokalen Mac/iPhone auswählen.
4. Die Törns und deren Zahl prüfen. **Nur wenn im Browser noch kein Törn gespeichert ist**, erscheint der Button „Nur auf leerem Gerät: vollständigen Originalstand wiederherstellen“.
5. Nach Bestätigung werden **alle Törns, IDs und der aktive Törn** lokal eingerichtet. Bestehende alte Supabase-Cloud wird nicht verändert.
6. Zusätzlich ein JSON-Backup der jetzt eingerichteten Daten erstellen. Erst dann ggf. „GitHub Speichern“ anklicken und den Inhalt in `phusch/huschel-app-data/toernplaner/data.json` sichern. Server-APP-ID `toernplaner` muss freigegeben sein.

## Bestehende produktive Installation
- Wenn `chillout-pirates-trips-v1`, der zusätzliche Huschel-Lokalspeicher oder das alte Speicherformat bereits belegt ist, ist der vollständige Erstimport **gesperrt**.
- In diesem Fall bleibt nur die schon getestete sicherheitsorientierte Funktion **„Ausgewählte Törns als neue Kopien übernehmen“**. Diese vergibt neue IDs/Namen und ersetzt keine Zahlungen.
- Auch das alte normale App-Menü „Backup importieren“ existiert weiterhin, kann jedoch den gesamten Datenbestand überschreiben. Für den laufenden Betrieb **nicht verwenden**, solange du den Originalstand nicht ausdrücklich ersetzen willst.
- Nicht dieselbe produktive URL ungeprüft durch eine Testinstallation ersetzen. Lokale Daten hängen an Domain und Browser.

## Dauerhafte Aufbewahrung
- Die private JSON-Datei auf Mac/iCloud/externem Datenträger außerhalb öffentlicher Repositories aufbewahren.
- GitHub als verschlüsselt über HTTPS erreichbaren, **privaten** Cloud-Speicher erst nach bewusster Anmeldung und „GitHub Speichern“ verwenden (Server-Secret, Benutzerprüfung, Konfliktschutz bleiben Bestandteil des bekannten Huschel-Moduls).
- Die Archiv-ZIP ist eine feste Momentaufnahme des Uploads. **Spätere Änderungen** in der laufenden App werden dadurch nicht automatisch aktualisiert. Regelmäßig manuell auf GitHub speichern sowie neue JSON-Backups erstellen.
- ChatGPT speichert die persönlichen JSON-Daten nicht automatisch dauerhaft in deiner privaten GitHub-Ablage.

## Änderungen zu V1.5.7
- `index.html`: rein additive Schaltfläche für vollständige Wiederherstellung ausschließlich auf einem nachweislich noch leeren Gerät. Gesicherte IDs und aktiver Törn bleiben unverändert. Zusätzliche Browser-Sicherheitsprüfungen und Rückfall bei Speicherfehler.
- `huschel-toern-speicher.js`: Vorschau erklärt den neuen Erstimport und ermöglicht ihn nur nach ausdrücklicher Bestätigung.
- `sw.js`: neuer Cache-Name für die Testversion.
- Unverändert: Kosten-/Giftmann-/Wise-Berechnung, alle übrigen Fachfunktionen, bestehende Supabase-Cloud, bisherige lokale Speicherung, Backup-Export, Bilddateien und Texte.

## Installation
Die Dateien **im Ordner `Toernplaner_V1.5.8_Datenstand_SicherheitsTest/`** sind das öffentliche App-Paket. Dieses ZIP enthält KEINE individuellen hochgeladenen Zahlungsdaten. Die separate private Daten-ZIP NIEMALS ins öffentliche Repository hochladen.

Diese Version ist eine **separate Testversion** und keine produktive Umstellung. Erst nach Prüfung des Einmalimports und des Speicherstands freigeben.
