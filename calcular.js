// Lista de Hosts por máscara
var Mascaras = {
    "32": 1,
    "31": 2,
    "30": 4,
    "29": 8,
    "28": 16,
    "27": 32,
    "26": 64,
    "25": 128,
    "24": 256,
    "23": 512,
    "22": 1024,
    "21": 2048,
    "20": 4096,
    "19": 8192,
    "18": 16384,
    "17": 32768,
    "16": 65536,
    "15": 131072,
}

var TotalPortas = 64512

// Função para cálculo de CGNAT
function calc() {
    Privado = form.IP_Privado.value
    Publico = form.IP_Publico.value

    // Valida IP com máscara
    const ValidaIP = /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}\/\d+/;

    const ResultValidaIP_Privado = (ValidaIP.test(Privado))
    const ResultValidaIP_Publico = (ValidaIP.test(Publico))

    // Condicional de IPs válidos
    if (ResultValidaIP_Privado && ResultValidaIP_Publico == true) {
        // Separa as máscaras dos IPs
        var ValorMascPrivado = Privado.split("/")[1]
        var ValorMascPublico = Publico.split("/")[1]

        // Condicional de IP público ser menor que o IP privado
        if (ValorMascPrivado < ValorMascPublico) {
            // Consulta quantos Hosts há na máscara
            IPHostPrivado = Mascaras[ValorMascPrivado];
            IPHostPublico = Mascaras[ValorMascPublico];

            // Cálculo de IPs privados por IP público
            QuantidadeIPs = IPHostPrivado / IPHostPublico;
            // Cálculo de portas por IP
            QuantidadePortas = Math.floor(TotalPortas / QuantidadeIPs);

            // Apresentação de resultados
            document.getElementById("IPsPrivadosApresentacao").innerHTML = IPHostPrivado;
            document.getElementById("IPsPublicosApresentacao").innerHTML = IPHostPublico;
            document.getElementById("QtdIPprivPpub").innerHTML = QuantidadeIPs;
            document.getElementById("QtdPortas").innerHTML = QuantidadePortas;
        }

        else {
            alert('O IP Privado deve ser maior que o IP Público, insira novamente');
        }

    }

    else {
        alert('Faixa de IP incorreta, insira novamente');
    }
}


function rel() {
    // Separa as faixas dos IPs
    var ValorFaixaPrivada = Privado.split('/')[0]
    var ValorFaixaPublica = Publico.split('/')[0]

    // Separa os octetos dos IPs
    OctetosPrivados = ValorFaixaPrivada.split('.')
    OctetosPublicos = ValorFaixaPublica.split('.')

    // Percorrer as portas e IPs
    var Contador = 0
    var PortaIn = 1024

    var p = PortaIn
    var aux = p
    aux += QuantidadePortas - 1

    // Converter octetos para variáveis inteiras
    j = parseInt(OctetosPrivados[3])
    j2 = parseInt(OctetosPrivados[2])
    i2 = parseInt(OctetosPublicos[2])

    for (i = OctetosPublicos[3]; Contador < IPHostPublico; i++) {
        ResultPublico = (OctetosPublicos[0] + '.' + OctetosPublicos[1] + '.' + i2 + '.' + i)
        ResultPrivado = (OctetosPrivados[0] + '.' + OctetosPrivados[1] + '.' + j2 + '.' + j)
        j += 1

        console.log(p + ' - ' + aux + ' --> ' + ResultPublico + ' --> ' + ResultPrivado)

        Contador += 1

        if (j > 255) {
            j = 0
            j2 += 1
        }

        if (i > 255) {
            i = 0
            i2 += 1
        }

        if (Contador >= IPHostPublico) {
            i = OctetosPublicos[3] - 1
            Contador = 0

            p += QuantidadePortas
            aux = p - 1
            aux += QuantidadePortas
        }

        if (aux > 65535) {
            break
        }

    }
}