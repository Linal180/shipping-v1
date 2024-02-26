import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error) {
    console.log(error)
  }
};

export const comparePassword = async (password: string, hashPassword: string) => {
  return bcrypt.compare(password, hashPassword);
}

export const  generateRandomNumbers = () => {
  let result = '';
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}

export const generateLabelFileUrl = (id: string) => {
  return `${process.env.BASE_URL || 'https://shipping-v1.vercel.app'}/shipping/get-file/${id}`
}