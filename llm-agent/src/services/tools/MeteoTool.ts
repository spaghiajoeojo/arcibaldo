import { Tool } from './Tool';

type OpenMeteo = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
  };
};

export class MeteoTool implements Tool {
  name = 'meteo';

  desc = 'uno strumento che permette di ottenere la temperatura e la umidità attuale';

  input = 'nessuno';

  public async use() {
    return fetch('https://api.open-meteo.com/v1/forecast?latitude=41.8919&longitude=12.5113&current=temperature_2m,relative_humidity_2m')
      .then((response) => response.json())
      .then((data: unknown) => data as OpenMeteo)
      .then((data) => `temperatura: ${data.current.temperature_2m}°C, umidità: ${data.current.relative_humidity_2m}%`);
  }
}
