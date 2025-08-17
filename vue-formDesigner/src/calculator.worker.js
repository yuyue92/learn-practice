// 模拟耗时计算
function heavyCalculation(data) {
    let result = 0;
    for (let i = 0; i < data.maxIterations; i++) {
      result += Math.sqrt(i) * Math.random();
      // 模拟进度更新
      if (i % 100000 === 0) {
        self.postMessage({
          type: 'progress',
          progress: (i / data.maxIterations) * 100
        });
      }
    }
    return result;
  }
  
  self.onmessage = function(e) {
    const { type, data } = e.data;
    
    if (type === 'start') {
      const result = heavyCalculation(data);
      self.postMessage({
        type: 'result',
        result: result
      });
    }
  };