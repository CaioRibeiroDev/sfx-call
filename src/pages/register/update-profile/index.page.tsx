import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type updateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<updateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  async function handleUpdateProfile(data: updateProfileData) {
    await api.put('/users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  const session = useSession()
  const router = useRouter()

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size={'sm'}>Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.name}
          />
        </label>

        <label>
          <Text>Sobre Você</Text>
          <TextArea placeholder="Seu nome" {...register('bio')} />
          <FormAnnotation size={'sm'}>
            Fale um pouco sobre você. Isto será exibido em sua pagina pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}
