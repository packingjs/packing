import ajax from 'packing-ajax';

// 获取profile变量
console.log('cdnRoot: %s, me.name: %s', __('cdnRoot'), __('me.name'));

ajax({
  url: '/api/getTimestamp',
  success: (data) => {
    document.getElementById('now').innerHTML = data.now;
  }
});
