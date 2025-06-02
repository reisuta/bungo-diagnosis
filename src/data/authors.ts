export interface Author {
  id: string;
  name: string;
  type: string;
  description: string;
}

export const authors: Author[] = [
  { id: 'dazai', name: '太宰治', type: '破産型タイプ', description: '' },
  { id: 'akutagawa', name: '芥川龍之介', type: '繊細タイプ', description: '' },
  { id: 'natume', name: '夏目漱石', type: '権威タイプ', description: '' },
  { id: 'ougai', name: '森鷗外', type: '博学タイプ', description: '' },
  { id: 'itiyou', name: '樋口一葉', type: '天才タイプ', description: '' },
  { id: 'siga', name: '志賀直哉', type: '金持ちタイプ', description: '' },
  { id: 'saneatu', name: '武者小路実篤', type: '愚直タイプ', description: '' },
  { id: 'tanizaki', name: '谷崎潤一郎', type: '変態タイプ', description: '' },
  { id: 'kahuu', name: '永井荷風', type: '性欲タイプ', description: '' },
  { id: 'simada', name: '島田清次郎', type: '刹那タイプ', description: '' },
  { id: 'kikuti', name: '菊池寛', type: 'ビジネスタイプ', description: '' },
  { id: 'kazii', name: '梶井基次郎', type: 'センスタイプ', description: '' },
  { id: 'kouyou', name: '尾崎紅葉', type: '親分タイプ', description: '' },
  { id: 'bizan', name: '川上眉山', type: '無冠の天才タイプ', description: '' },
  { id: 'ranpo', name: '江戸川乱歩', type: '放浪タイプ', description: '' },
  { id: 'zenzou', name: '葛西善蔵', type: 'ほろ酔いタイプ', description: '' },
];