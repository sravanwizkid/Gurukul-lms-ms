export interface RouterLayer {
  name: string;
  route?: {
    path: string;
    methods: {
      [key: string]: boolean;
    };
  };
  handle: {
    stack: RouterLayer[];
  };
}

export interface StudentRoute {
  route?: {
    path: string;
    methods: {
      [key: string]: boolean;
    };
  };
  stack: RouterLayer[];
} 