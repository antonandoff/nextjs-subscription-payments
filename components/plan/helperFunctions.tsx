"use server"
import { getActiveProductsWithPrices, createTenantForCheckout, getSession, getUserDetails} from '@/app/supabase-server';

export async function activePlans(){
  const pricingData =  await getActiveProductsWithPrices();
  const pricingDataWithPlans = pricingData.filter((item:any)=> item.metadata.type === 'plan');
  return pricingDataWithPlans
}

export async function createTenant(data:any) {
  const req = await createTenantForCheckout(data)
  return req
}

export async function getUserId(){
  const req = await getSession()
  return req?.user
}

export const randomNoun = async () => {
  const apiKey = 'nv7782nrqvr2jcn60vjzmala09h9tqmg31wgdh8blbmdg5vij';
  // const url = 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=1&api_key=' + apiKey;
  const url = 'https://random-word-api.herokuapp.com/word?number=1'
  const nounReq = await fetch(url);
  const nounRes = await nounReq.json();
  // const nouns = nounRes.map((word: { word: string }) => word.word.charAt(0).toUpperCase() + word.word.slice(1));
  return nounRes[0];
}

export const randomVerb = async () => {
  const apiKey = 'nv7782nrqvr2jcn60vjzmala09h9tqmg31wgdh8blbmdg5vij';
  // const url = 'https://api.wordnik.com/v4/words.json/randomWords?includePartOfSpeech=verb&&api_key=' + apiKey;
  const url = 'https://random-word-api.herokuapp.com/word?number=1'
  const verbReq = await fetch(url);
  const verbRes = await verbReq.json();
  // const verbs = verbRes.map((word: { word: string }) => word.word.charAt(0).toUpperCase() + word.word.slice(1));
  return verbRes[0];
}

export async function randomWords(){
  console.log('here')
  const verbs = await randomVerb();
  const nouns = await randomNoun();

  // const x = verbs[Math.floor(Math.random() * verbs.length)];
  // const y = nouns[Math.floor(Math.random() * nouns.length)];

  console.log(verbs, nouns)
  return `${verbs}${nouns}`;
}