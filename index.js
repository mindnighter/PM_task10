const search = document.querySelector('button');
const input = document.querySelector('input');
const user = document.querySelector('.user');
const notExist = document.querySelector('.notExist');

const getData = async (url, value) => {
  if (value) {
    return await (await fetch(`${url}${value}`)).json();
  }
  return false;
}

const getInfo = async (url) => await (await fetch(`${url}`)).json();

const find = async () => {
  const url = `https://api.github.com/search/users?q=`;
  const data = await getData(url, input.value);
  console.log(data);
  if (data && data.items.length) {
    showUser(data.items[0]);
  } else {
    user.style.display = "none";
    notExist.style.display = "block";
  }
}

const debounceDecorator = (f, ms) => {
  let isCooldown = false;
  return () => {
    if (isCooldown) return;
    isCooldown = true;
    setTimeout(() => {
      isCooldown = false
      f();
    }, ms);
  };
}
const debounce = debounceDecorator(find,500);

input.addEventListener('input', () => {
  debounce();
});

search.addEventListener('click', find);

const showUser = (data) => {
  createAvatar(data);
  create('followers', data.followers_url, data.login);
  create('following', data.following_url, data.login);
  create('repos', data.repos_url, data.login);
}

const createAvatar = (data) => {
  notExist.style.display = "none";
  user.style.display = "block";
  const profile = document.querySelector('.profile');
  profile.setAttribute('href', data.html_url);
  const img = document.querySelector('img');
  img.setAttribute('src', data.avatar_url);
  const name = document.querySelector('.profile h2');
  name.innerText = data.login;
}

const create = async (title, data, login) => {
  const url = `https://api.github.com/users/${login}/${title}`;
  data = await getInfo(url);
  const element = document.querySelector(`.${title}`);
  element.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerText = title;
  element.append(h2);
  if (title == 'repos') {
    repos(data, element);
  } else {
    notRepos(data, element);
  }
}

const repos = (data, element) => {
  data.map((elem) => {
    const div = document.createElement('div');
    const a = document.createElement('a');
    const url = `https://github.com/${elem.owner.login}/${elem.name}`;
    a.setAttribute('href', url);
    a.innerText = elem.name;
    div.append(a);
    element.append(div);
  });
}

const notRepos = (data, element) => {
  data.map((elem) => {
    const div = document.createElement('div');
    const a = document.createElement('a');
    const img = document.createElement('img');
    const p = document.createElement('p');
    img.style.height = '100px';
    a.setAttribute('href', elem.html_url);
    img.setAttribute('src', elem.avatar_url);
    a.append(img);
    p.innerText = elem.login;
    a.append(p);
    div.append(a);
    element.append(div);
  });
}