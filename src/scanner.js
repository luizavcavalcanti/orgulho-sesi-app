import { Html5Qrcode } from 'html5-qrcode';

const ID_ELEMENTO = 'leitor-camera';

// html5-qrcode cuida de pedir permissão de câmera e decodificar os frames;
// aqui só empacotamos start/stop pra não vazar isso pelas views.
export class LeitorQR {
  constructor() {
    this.instancia = null;
  }

  async iniciar(aoLer) {
    this.instancia = new Html5Qrcode(ID_ELEMENTO);
  const config = {
      fps: 10,
      // A area de leitura acompanha o tamanho do video em vez de ser fixa:
      // em tela pequena um quadro de 240px sobra, em tela grande falta.
      qrbox: (larguraVideo, alturaVideo) => {
        const lado = Math.floor(Math.min(larguraVideo, alturaVideo) * 0.75);
        return { width: lado, height: lado };
      },
      aspectRatio: 1,
    };

    let jaLeu = false;
    await this.instancia.start(
      { facingMode: 'environment' },
      config,
      (textoDecodificado) => {
        // Sem essa trava, o mesmo QR dispara várias vezes por segundo
        // enquanto a câmera continua enquadrando o código.
        if (jaLeu) return;
        jaLeu = true;
        aoLer(extrairCodigo(textoDecodificado));
      },
      () => {
        // frame sem QR legível, ignorado de propósito
      }
    );
  }

  async parar() {
    if (!this.instancia) return;
    try {
      await this.instancia.stop();
      this.instancia.clear();
    } catch {
      // câmera pode já ter sido liberada se a view trocou rápido
    }
    this.instancia = null;
  }
}

// Aceita tanto um id puro ("oficina-robotica") quanto uma URL completa
// (https://.../scan?atividade=oficina-robotica), pra dar liberdade na hora
// de gerar os QR codes de cada estação do evento.
function extrairCodigo(textoLido) {
  try {
    const url = new URL(textoLido);
    const idPelaQuery = url.searchParams.get('atividade');
    if (idPelaQuery) return idPelaQuery;
  } catch {
    // não era uma URL, segue como texto puro
  }
  return textoLido.trim();
}
