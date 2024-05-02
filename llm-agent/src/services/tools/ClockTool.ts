import { Tool } from './Tool';

export class ClockTool implements Tool {
  name = 'clock';

  desc = 'strumento per conoscere l\'orario attuale';

  input = 'nessuno';

  async use(): Promise<string> {
    return (new Date()).toLocaleString('it-IT', {
      timeZone: 'Europe/Rome',
      hour: '2-digit',
      minute: '2-digit',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      weekday: 'long',
    });
  }
}
