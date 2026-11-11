import dwave from '../assets/quantum-evolution/dwave.webp';
import sycamore from '../assets/quantum-evolution/sycamore.webp';
import fridge from '../assets/quantum-evolution/fridge.webp';

const ref = (label, url) => ({ label, url });

export const media = {
  dwave: {
    src: dwave, alt: 'Bagian dalam perangkat kuantum kriogenik D-Wave',
    caption: 'Foto perangkat kuantum D-Wave, 2009', credit: 'Steve Jurvetson',
    source: 'https://commons.wikimedia.org/wiki/File:Quantum_Computer_(3796519198).jpg',
    license: ref('CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'),
  },
  sycamore: {
    src: sycamore, alt: 'Cip Google Sycamore yang dipamerkan di Deutsches Museum',
    caption: 'Cip Google Sycamore di Deutsches Museum', credit: 'Coldupnorth',
    source: 'https://commons.wikimedia.org/wiki/File:Sycamore_Quantum_Chip.jpg',
    license: ref('CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'),
  },
  fridge: {
    src: fridge, alt: 'Ilustrasi kulkas pengenceran dengan label tahapan suhu dan jalur kabel',
    caption: 'Ilustrasi berlabel sistem dilution refrigerator', credit: 'Onri Jay Benally / OJB Quantum',
    source: 'https://commons.wikimedia.org/wiki/File:Dilution_Fridge_in_English.png',
    license: ref('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/'),
  },
};

const hardware = ref('IBM · Sistem kriogenik modular', 'https://newsroom.ibm.com/2026-08-19-ibm-connects-its-first-modular-cryogenic-systems-in-milestone-toward-fault-tolerant-quantum-computing/');
const braket = ref('AWS · Perangkat dan simulator Braket', 'https://docs.aws.amazon.com/braket/latest/developerguide/braket-devices.html');
const azure = ref('Microsoft Learn · Penyedia Azure Quantum', 'https://learn.microsoft.com/en-us/azure/quantum/qc-target-list');

export const slides = [
  {
    title: 'Fondasi', period: '1964–1982', image: 'dwave',
    heading: 'Korelasi kuantum melampaui model klasik lokal',
    text: 'Bell merumuskan batas korelasi untuk teori variabel tersembunyi lokal. Eksperimen Aspect dan tim menguji batas tersebut, memberi landasan empiris untuk memahami entanglement.',
    takeaway: 'Foto perangkat D-Wave dipakai sebagai konteks visual. Eksperimen Bell berbeda dari eksperimen komputasi.',
    sources: [ref('Bell · On the Einstein Podolsky Rosen paradox', 'https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195'), ref('Aspect dkk. · Uji eksperimental ketaksamaan Bell', 'https://doi.org/10.1103/PhysRevLett.49.1804')],
  },
  {
    title: 'Konsep', period: '1980–1985', image: 'sycamore',
    heading: 'Informasi diproses melalui keadaan kuantum',
    text: 'Benioff memodelkan komputer sebagai sistem kuantum. Feynman mengusulkan simulasi fisika dengan sistem kuantum, lalu Deutsch merumuskan model komputasi kuantum universal.',
    takeaway: 'Keadaan qubit, operasi terkontrol, dan pengukuran menjadi bagian dari model komputasi.',
    sources: [ref('Benioff · Model mekanika kuantum untuk komputer', 'https://doi.org/10.1007/BF01011339'), ref('Feynman · Simulating physics with computers', 'https://doi.org/10.1007/BF02650179'), ref('Deutsch · Universal quantum computer', 'https://doi.org/10.1098/rspa.1985.0070')],
  },
  {
    title: 'Algoritma', period: '1994–1996', image: 'sycamore',
    heading: 'Percepatan bergantung pada masalah',
    text: 'Shor menunjukkan algoritma waktu polinomial untuk faktorisasi dan logaritma diskret pada model kuantum. Grover memberi pengurangan kuadratik dalam jumlah kueri untuk pencarian tak terstruktur.',
    takeaway: 'Keunggulan matematis perlu dibaca bersama biaya menyiapkan input, menjalankan gerbang, dan mengoreksi galat.',
    sources: [ref('Shor · Algorithms for quantum computation', 'https://doi.org/10.1109/SFCS.1994.365700'), ref('Grover · A fast quantum mechanical algorithm', 'https://doi.org/10.1145/237814.237866')],
  },
  {
    title: 'Hardware', period: 'Perangkat fisik', image: 'dwave',
    heading: 'Setiap platform punya cara membentuk qubit',
    text: 'Rangkaian superkonduktor memakai sirkuit yang dikendalikan secara elektronik. Ion terperangkap, atom netral, dan foton memakai pembawa informasi serta mekanisme kontrol yang berbeda. Foto menunjukkan perangkat D-Wave untuk quantum annealing.',
    takeaway: 'Bandingkan fidelitas, konektivitas, dan kedalaman rangkaian yang bisa dijalankan. Kebutuhan pendinginan bergantung pada platform.',
    sources: [ref('IBM · Quantum hardware', 'https://www.ibm.com/quantum/hardware'), ref('AWS · Ragam platform QPU', 'https://aws.amazon.com/braket/quantum-computers/')],
  },
  {
    title: 'Cloud', period: 'Akses jarak jauh', image: 'fridge',
    heading: 'Simulator dan QPU tersedia melalui layanan cloud',
    text: 'Peneliti menyiapkan rangkaian di komputer klasik, memilih target, mengirim pekerjaan, lalu mengambil hasil pengukuran. Target dapat berupa simulator klasik atau prosesor kuantum fisik milik penyedia.',
    takeaway: 'Bandingkan biaya per eksekusi, antrean, jumlah pengukuran, dan batas perangkat sesuai kebutuhan eksperimen.',
    sources: [braket, azure],
  },
  {
    title: 'Advantage', period: 'Benchmark dan risiko', image: 'sycamore',
    heading: 'Keunggulan pada tugas tertentu dapat mengubah risiko',
    text: 'Eksperimen Sycamore menguji random circuit sampling pada tugas dan pembanding tertentu. Secara terpisah, komputer kuantum yang cukup andal dan berskala memadai berpotensi menjalankan algoritma yang mengancam asumsi keamanan kriptografi kunci publik tertentu.',
    takeaway: 'Benchmark sampling belum membuktikan pemecahan RSA atau ECC. Pisahkan hasil benchmark, kebutuhan perangkat kriptanalisis, dan paparan sistem yang bergantung pada algoritma rentan.',
    sources: [ref('Arute dkk. · Benchmark Sycamore', 'https://doi.org/10.1038/s41586-019-1666-5'), ref('NIST · Post-Quantum Cryptography', 'https://www.nist.gov/cybersecurity-and-privacy/what-post-quantum-cryptography')],
  },
  {
    title: 'AI Application', period: '2024–2026', image: 'fridge',
    heading: 'AI membantu membaca galat dan menjaga kalibrasi',
    text: 'Koreksi galat mengodekan qubit logis pada beberapa qubit fisik. AlphaQubit memakai pembelajaran mesin untuk menafsirkan sinyal galat. Penelitian terpisah memakai reinforcement learning untuk menyesuaikan kontrol saat parameter perangkat bergeser.',
    takeaway: 'AI berperan sebagai lapisan kontrol klasik. Efektivitasnya ditentukan oleh akurasi, latensi, dan kondisi perangkat yang diuji.',
    sources: [ref('Nature · Koreksi galat di bawah ambang surface code', 'https://www.nature.com/articles/s41586-024-08449-y'), ref('Bausch dkk. · AlphaQubit', 'https://www.nature.com/articles/s41586-024-08148-8'), ref('Google Research · Kontrol adaptif dengan reinforcement learning', 'https://research.google/blog/towards-a-quantum-computer-that-learns-from-its-errors/')],
  },
];

export const physics = [
  ['Pendinginan bertahap', 'Dilution refrigerator memanfaatkan campuran helium-3 dan helium-4. Tahap paling dingin menampung cip dan membantu menekan eksitasi termal. Sebagai contoh, IBM melaporkan modul kriogenik yang didinginkan di bawah 15 mK, sekitar 0,015 K.'],
  ['Superkonduktivitas dan transmon', 'Di bawah suhu kritisnya, bahan rangkaian menjadi superkonduktor. Pada transmon, sambungan Josephson menghasilkan jarak tingkat energi yang tidak seragam, sehingga dua tingkat terendah dapat dipilih sebagai basis |0⟩ dan |1⟩.'],
  ['Kontrol gelombang mikro', 'Pulsa gelombang mikro yang diatur amplitudo, fase, dan durasinya dapat mengubah keadaan qubit. Perangkat kontrol klasik menyiapkan pulsa dan mengirimkannya melalui jalur yang ditapis dan ditambatkan secara termal.'],
  ['Pembacaan keadaan', 'Keadaan qubit memengaruhi respons resonator yang terhubung dengannya. Elektronika membaca respons sinyal, lalu mengklasifikasikan satu hasil pengukuran sebagai 0 atau 1. Eksperimen diulang untuk mengestimasi peluang.'],
  ['Koherensi dan galat', 'Suhu rendah mengurangi sebagian gangguan termal. Relaksasi, hilangnya fase, ketidaksempurnaan pulsa, dan derau pembacaan tetap dapat menimbulkan galat, sehingga isolasi dan kalibrasi juga diperlukan.'],
];

export const physicsSources = [hardware, ref('Koch dkk. · Desain transmon', 'https://doi.org/10.1103/PhysRevA.76.042319'), ref('Krantz dkk. · Panduan rekayasa qubit superkonduktor', 'https://doi.org/10.1063/1.5089550')];

export const companies = [
  { name: 'IBM Quantum', symbol: 'IBM', type: 'Pengembang hardware', summary: 'Mengembangkan prosesor superkonduktor dan rekayasa sistem kriogenik modular.', sources: [ref('IBM · Hardware dan roadmap', 'https://www.ibm.com/quantum/hardware'), hardware] },
  { name: 'Amazon Web Services', symbol: 'AWS', type: 'Platform cloud', summary: 'Amazon Braket memberi akses ke simulator dan perangkat dari sejumlah penyedia hardware.', sources: [braket] },
  { name: 'Google Quantum AI', symbol: 'G', type: 'Pengembang hardware dan riset', summary: 'Mengembangkan prosesor superkonduktor Willow serta meneliti koreksi galat kuantum.', image: 'sycamore', sources: [ref('Google · Willow', 'https://blog.google/innovation-and-ai/technology/research/google-willow-quantum-chip/')] },
  { name: 'Microsoft Azure Quantum', symbol: 'MS', type: 'Platform cloud', summary: 'Azure Quantum menyediakan akses ke target komputasi kuantum dan simulator dari penyedia mitra.', sources: [azure] },
  { name: 'D-Wave', symbol: 'DW', type: 'Pengembang hardware annealing', summary: 'Mengembangkan sistem quantum annealing untuk formulasi optimasi. Jenis komputasinya dibedakan dari rangkaian universal berbasis gerbang.', image: 'dwave', sources: [ref('D-Wave · Quantum computers', 'https://www.dwavequantum.com/solutions-and-products/systems/')] },
  { name: 'Quantinuum', symbol: 'Q', type: 'Pengembang hardware trapped-ion', summary: 'Keluarga H-Series memakai ion terperangkap. Informasi tentang perangkat H2 dan emulator tersedia di katalog Azure Quantum.', sources: [azure] },
];
