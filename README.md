# Factuurr 🚀

Factuurr is een razendsnelle, privacy-vriendelijke web-applicatie voor het genereren van professionele facturen en offertes, specifiek ontworpen voor de Belgische markt.

## ✨ Features

- **Facturen & Offertes**: Schakel eenvoudig tussen het maken van een factuur of een offerte.
- **Belgische Wetgeving**: Ingebouwde ondersteuning voor de "Bijzondere vrijstellingsregeling kleine ondernemingen" (Vrijgesteld van BTW).
- **Live Preview**: Bekijk direct hoe je document eruit ziet terwijl je typt.
- **PDF Export**: Download je documenten als hoogwaardige PDF-bestanden.
- **Logo Support**: Upload je eigen bedrijfslogo voor een professionele uitstraling op al je documenten.
- **Instellingen Opslaan**: Exporteer en importeer je bedrijfsgegevens via een JSON-bestand, zodat je ze nooit twee keer hoeft in te vullen.
- **Dark Mode**: Oogvriendelijk ontwerp voor de late uurtjes, volledig responsief.
- **Privacy First**: Geen database, geen cloud-opslag. Al je gegevens blijven 100% in je eigen browser.

## 🛠️ Technologie

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS met een gepersonaliseerd Premium Design System.
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generatie**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Type Safety**: TypeScript

## 🚀 Aan de slag

### Installatie

1. Clone de repository:
   ```bash
   git clone https://github.com/jouwgebruikersnaam/factuurr.git
   ```

2. Installeer de benodigde pakketten:
   ```bash
   npm install
   ```

3. Start de ontwikkelomgeving:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in je browser om de app te gebruiken.

## 📝 Gebruik

1. **Bedrijfsgegevens**: Vul je eigen gegevens in bij de sectie "Mijn Bedrijfsgegevens".
2. **Bespaar Tijd**: Klik op de **Export** knop om je gegevens op te slaan als een `.json` bestand. Bij een volgend bezoek kun je dit bestand simpelweg **Importeren**.
3. **Opstellen**: Voeg items toe, geef ze een naam en een uitgebreide beschrijving. Pas aantallen en prijzen aan.
4. **BTW**: Schakel de "Kleine onderneming" modus in als je vrijgesteld bent van BTW. De app voegt automatisch de wettelijk verplichte vermelding toe.
5. **Downloaden**: Zodra je tevreden bent met het live voorbeeld, klik je op **Download PDF**.

## 📄 Licentie

Dit project is beschikbaar onder de MIT-licentie.
